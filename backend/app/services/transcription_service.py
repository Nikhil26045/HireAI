import logging
import os
import subprocess
import tempfile
import time
from pathlib import Path
from threading import Lock
from uuid import UUID

from faster_whisper import WhisperModel
from sqlalchemy.orm import Session, sessionmaker

from app.db.database import engine
from app.models.interview_response import (
    InterviewResponse,
    ResponseMediaType,
    ResponseStatus,
)
from app.models.transcription import Transcription

logger = logging.getLogger(__name__)

# Create independent database sessions for background processing.
BackgroundSessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

STORAGE_DIR = (
    Path(__file__).resolve().parents[2]
    / "storage"
    / "interview_responses"
)

MODEL_NAME = os.getenv("WHISPER_MODEL", "base")
MODEL_VERSION = "faster-whisper"

_model = None
_model_lock = Lock()


def get_whisper_model():
    """Load the model once per application process."""
    global _model

    if _model is None:
        with _model_lock:
            if _model is None:
                _model = WhisperModel(
                    MODEL_NAME,
                    device="cpu",
                    compute_type="int8",
                )

    return _model


def resolve_media_path(media_url: str) -> Path:
    """Resolve a stored media URL to a file within the storage directory."""
    filename = Path(media_url).name
    media_path = (STORAGE_DIR / filename).resolve()
    storage_root = STORAGE_DIR.resolve()

    if media_path.parent != storage_root:
        raise ValueError("Invalid media path.")

    if not media_path.is_file():
        raise FileNotFoundError("Interview media file was not found.")

    return media_path


def extract_audio_from_video(video_path: Path) -> Path:
    """Extract mono, 16 kHz WAV audio from a video using FFmpeg."""
    temp_file = tempfile.NamedTemporaryFile(
        suffix=".wav",
        dir=STORAGE_DIR,
        delete=False,
    )
    audio_path = Path(temp_file.name)
    temp_file.close()

    try:
        subprocess.run(
            [
                "ffmpeg",
                "-nostdin",
                "-y",
                "-i",
                str(video_path),
                "-vn",
                "-ac",
                "1",
                "-ar",
                "16000",
                "-c:a",
                "pcm_s16le",
                str(audio_path),
            ],
            check=True,
            capture_output=True,
            timeout=1800,
        )

        if not audio_path.is_file() or audio_path.stat().st_size == 0:
            raise RuntimeError("Audio extraction produced an empty file.")

        return audio_path

    except Exception:
        audio_path.unlink(missing_ok=True)
        raise


def transcribe_audio(audio_path: Path) -> tuple[str, str | None, float]:
    """Run Whisper and return transcript text, language and elapsed time."""
    model = get_whisper_model()
    started = time.perf_counter()

    segments, info = model.transcribe(
        str(audio_path),
        beam_size=5,
        vad_filter=True,
    )

    # Transcription starts when the segments generator is consumed.
    transcript_parts = [
        segment.text.strip()
        for segment in segments
        if segment.text.strip()
    ]

    transcript = " ".join(transcript_parts).strip()
    elapsed = time.perf_counter() - started

    return transcript, info.language, elapsed


def process_transcription(response_id: UUID) -> None:
    """
    Background entry point.

    Opens its own DB session, processes the media and saves the transcript.
    """
    db: Session = BackgroundSessionLocal()
    extracted_audio: Path | None = None

    try:
        response = (
            db.query(InterviewResponse)
            .filter(InterviewResponse.id == response_id)
            .first()
        )

        if response is None:
            logger.warning(
                "Interview response %s no longer exists.",
                response_id,
            )
            return

        if response.transcription is not None:
            response.response_status = ResponseStatus.COMPLETED
            db.commit()
            return

        if response.response_status not in (
            ResponseStatus.PROCESSING,
            ResponseStatus.FAILED,
        ):
            logger.warning(
                "Response %s is not ready for transcription.",
                response_id,
            )
            return

        response.response_status = ResponseStatus.PROCESSING
        db.commit()

        media_path = resolve_media_path(response.media_url)

        if response.media_type == ResponseMediaType.VIDEO:
            extracted_audio = extract_audio_from_video(media_path)
            audio_path = extracted_audio
        elif response.media_type == ResponseMediaType.AUDIO:
            audio_path = media_path
        else:
            raise ValueError("Unsupported response media type.")

        transcript, language, elapsed = transcribe_audio(audio_path)

        if not transcript:
            raise ValueError(
                "Whisper did not detect any speech in the recording."
            )

        existing = (
            db.query(Transcription)
            .filter(Transcription.response_id == response_id)
            .first()
        )

        if existing is None:
            existing = Transcription(
                response_id=response_id,
                transcript_text=transcript,
                language=language,
                model_name=MODEL_NAME,
                model_version=MODEL_VERSION,
                processing_time_seconds=elapsed,
            )
            db.add(existing)
        else:
            existing.transcript_text = transcript
            existing.language = language
            existing.model_name = MODEL_NAME
            existing.model_version = MODEL_VERSION
            existing.processing_time_seconds = elapsed

        response.response_status = ResponseStatus.COMPLETED
        db.commit()

        logger.info(
            "Transcription completed for response %s in %.2f seconds.",
            response_id,
            elapsed,
        )

    except Exception:
        db.rollback()
        logger.exception(
            "Transcription failed for response %s.",
            response_id,
        )

        try:
            response = (
                db.query(InterviewResponse)
                .filter(InterviewResponse.id == response_id)
                .first()
            )

            if response is not None:
                response.response_status = ResponseStatus.FAILED
                db.commit()

        except Exception:
            db.rollback()
            logger.exception(
                "Could not update failure status for response %s.",
                response_id,
            )

    finally:
        if extracted_audio is not None:
            extracted_audio.unlink(missing_ok=True)

        db.close()


def request_transcription(
    db: Session,
    response: InterviewResponse,
) -> str:
    """Set a response to PROCESSING before scheduling its background task."""
    if response.transcription is not None:
        response.response_status = ResponseStatus.COMPLETED
        db.commit()
        return "Transcription already exists."

    if response.response_status == ResponseStatus.PROCESSING:
        return "Transcription is already processing."

    response.response_status = ResponseStatus.PROCESSING
    db.commit()

    return "Transcription queued."