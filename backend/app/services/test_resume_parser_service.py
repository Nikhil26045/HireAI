import re
import uuid
from datetime import datetime, timezone
from pathlib import Path

import spacy
from sqlalchemy.orm import Session

from app.models.parsed_resume import ParsedResume
from app.models.resume import (
    Resume,
    ResumeProcessingStatus,
)


# ============================================================
# spaCy
# ============================================================

nlp = spacy.load("en_core_web_sm")


# ============================================================
# Technical Skills
# ============================================================

TECHNICAL_SKILLS = {
    # Programming languages
    "python",
    "java",
    "javascript",
    "typescript",
    "c",
    "c++",
    "c#",
    "go",
    "rust",
    "php",
    "ruby",
    "kotlin",
    "swift",
    "r",
    "matlab",
    "verilog",
    "vhdl",
    "scala",

    # Web
    "html",
    "css",
    "react",
    "react.js",
    "next.js",
    "angular",
    "vue",
    "node.js",
    "express",
    "fastapi",
    "flask",
    "django",
    "bootstrap",
    "tailwind",
    "rest api",
    "rest",
    "graphql",
    "microservices",

    # Databases
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "redis",
    "oracle",
    "sqlite",
    "mariadb",
    "database",

    # Python / Data
    "numpy",
    "pandas",
    "matplotlib",
    "seaborn",
    "scipy",
    "jupyter",

    # Machine Learning / AI
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "nlp",
    "natural language processing",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "sklearn",
    "spacy",
    "bert",
    "whisper",
    "gpt",
    "gpt-2",
    "llm",
    "llms",

    # Backend / ORM
    "sqlalchemy",
    "alembic",
    "pydantic",
    "uvicorn",

    # Cloud / DevOps
    "docker",
    "kubernetes",
    "git",
    "github",
    "gitlab",
    "bitbucket",
    "aws",
    "azure",
    "gcp",

    # Salesforce
    "salesforce",
    "apex",
    "soql",

    # Analytics / BI
    "tableau",
    "power bi",
    "powerbi",
    "etl",
    "data analytics",
    "data analysis",
    "business intelligence",

    # Engineering / Embedded
    "embedded systems",
    "stm32",
    "cortex-m4",
    "qemu",
    "gdb",
    "ti ccs",
    "ltspice",
    "octave",
    "xammp",
    "xampp",

    # Other tools
    "figma",
    "latex",
    "claude cli",
    "microsoft excel",
    "excel",
    "vba",
}


# ============================================================
# Skill aliases
# Canonical skill -> possible resume representations
# ============================================================

SKILL_ALIASES = {
    "Python": ["python"],
    "Java": ["java"],
    "JavaScript": ["javascript", "js"],
    "TypeScript": ["typescript", "ts"],
    "C": ["c"],
    "C++": ["c++", "cpp"],
    "C#": ["c#"],
    "Go": ["go"],
    "Rust": ["rust"],
    "PHP": ["php"],
    "Ruby": ["ruby"],
    "Kotlin": ["kotlin"],
    "Swift": ["swift"],
    "R": ["r"],
    "MATLAB": ["matlab"],
    "Verilog": ["verilog"],
    "VHDL": ["vhdl"],

    "HTML": ["html"],
    "CSS": ["css"],
    "React": ["react", "react.js"],
    "Next.js": ["next.js", "nextjs"],
    "Angular": ["angular"],
    "Vue": ["vue"],
    "Node.js": ["node.js", "nodejs"],
    "Express": ["express"],
    "FastAPI": ["fastapi"],
    "Flask": ["flask"],
    "Django": ["django"],
    "Bootstrap": ["bootstrap"],
    "Tailwind": ["tailwind"],

    "SQL": ["sql"],
    "PostgreSQL": ["postgresql", "postgres"],
    "MySQL": ["mysql"],
    "MongoDB": ["mongodb"],
    "Redis": ["redis"],
    "Oracle": ["oracle"],
    "SQLite": ["sqlite"],

    "NumPy": ["numpy"],
    "Pandas": ["pandas"],
    "Matplotlib": ["matplotlib"],
    "Seaborn": ["seaborn"],
    "SciPy": ["scipy"],
    "Jupyter": ["jupyter"],

    "Machine Learning": ["machine learning"],
    "Deep Learning": ["deep learning"],
    "Artificial Intelligence": [
        "artificial intelligence",
        "artificial-intelligence",
    ],
    "NLP": [
        "nlp",
        "natural language processing",
    ],
    "TensorFlow": ["tensorflow"],
    "PyTorch": ["pytorch"],
    "scikit-learn": [
        "scikit-learn",
        "sklearn",
    ],
    "spaCy": ["spacy"],
    "BERT": ["bert"],
    "Whisper": ["whisper"],
    "GPT-2": ["gpt-2", "gpt 2"],
    "LLM": ["llm", "llms"],

    "SQLAlchemy": ["sqlalchemy"],
    "Alembic": ["alembic"],
    "Pydantic": ["pydantic"],
    "Uvicorn": ["uvicorn"],

    "Docker": ["docker"],
    "Kubernetes": ["kubernetes"],
    "Git": ["git"],
    "GitHub": ["github"],
    "GitLab": ["gitlab"],
    "Bitbucket": ["bitbucket"],
    "AWS": ["aws"],
    "Azure": ["azure"],
    "GCP": ["gcp"],

    "Salesforce": ["salesforce"],
    "Apex": ["apex"],
    "SOQL": ["soql"],

    "REST API": ["rest api"],
    "REST": ["rest"],
    "GraphQL": ["graphql"],
    "Microservices": ["microservices"],

    "Tableau": ["tableau"],
    "Power BI": ["power bi", "powerbi"],
    "ETL": ["etl"],
    "Data Analytics": ["data analytics"],
    "Data Analysis": ["data analysis"],
    "Business Intelligence": ["business intelligence"],

    "Embedded Systems": ["embedded systems"],
    "STM32": ["stm32"],
    "Cortex-M4": ["cortex-m4", "cortex-m4f"],
    "QEMU": ["qemu"],
    "GDB": ["gdb"],
    "TI CCS": ["ti ccs"],
    "LTSpice": ["ltspice"],
    "Octave": ["octave"],
    "XAMPP": ["xampp", "xammp"],

    "Figma": ["figma"],
    "LaTeX": ["latex"],
    "Claude CLI": ["claude cli"],
    "Excel": ["excel"],
    "VBA": ["vba"],
}


# ============================================================
# Resume Section Aliases
# ============================================================

SECTION_ALIASES = {
    "summary": {
        "summary",
        "professional summary",
        "profile",
        "objective",
        "career objective",
        "about me",
        "about",
    },

    "skills": {
        "skills",
        "technical skills",
        "technical expertise",
        "technical competencies",
        "core skills",
        "technologies",
        "technical proficiency",
    },

    "experience": {
        "experience",
        "work experience",
        "professional experience",
        "employment history",
        "work history",
        "internships",
        "internship",
    },

    "education": {
        "education",
        "academic background",
        "academic qualifications",
        "educational qualifications",
        "education qualifications",
    },

    "projects": {
        "projects",
        "key projects",
        "personal projects",
        "academic projects",
        "project experience",
        "key project",
    },

    "certifications": {
        "certifications",
        "certificates",
        "licenses & certifications",
        "certification",
    },

    "achievements": {
        "achievements",
        "scholastic achievements",
        "academic achievements",
        "scholastic",
        "awards",
        "honors",
        "honours",
    },

    "positions": {
        "positions of responsibility",
        "positions of responsibilities",
        "position of responsibility",
        "leadership",
        "leadership experience",
        "responsibilities",
    },

    "extracurricular": {
        "extra curricular activities",
        "extracurricular activities",
        "extracurricular",
        "extra curricular",
        "activities",
    },

    "coursework": {
        "relevant courses",
        "relevant coursework",
        "coursework",
        "academic courses",
    },
}


# ============================================================
# Heading normalization
# Handles PDF extraction such as:
#
# TECHNICALSKILLS
# KEYPROJECTS
# POSITIONSOFRESPONSIBILITIES
# ============================================================

HEADING_NORMALIZATION = {
    "summary": "summary",
    "professionalsummary": "professional summary",
    "profile": "profile",
    "objective": "objective",
    "careerobjective": "career objective",
    "aboutme": "about me",
    "about": "about",

    "skills": "skills",
    "technicalskills": "technical skills",
    "technicalexpertise": "technical expertise",
    "technicalcompetencies": "technical competencies",
    "coreskills": "core skills",
    "technologies": "technologies",
    "technicalproficiency": "technical proficiency",

    "experience": "experience",
    "workexperience": "work experience",
    "professionalexperience": "professional experience",
    "employmenthistory": "employment history",
    "workhistory": "work history",
    "internships": "internships",
    "internship": "internship",

    "education": "education",
    "academicbackground": "academic background",
    "academicqualifications": "academic qualifications",
    "educationalqualifications": "educational qualifications",
    "educationqualifications": "education qualifications",

    "projects": "projects",
    "keyprojects": "key projects",
    "personalprojects": "personal projects",
    "academicprojects": "academic projects",
    "projectexperience": "project experience",
    "keyproject": "key project",

    "certifications": "certifications",
    "certificates": "certificates",
    "licensescertifications": "licenses & certifications",
    "certification": "certification",

    "achievements": "achievements",
    "scholasticachievements": "scholastic achievements",
    "academicachievements": "academic achievements",
    "scholastic": "scholastic",
    "awards": "awards",
    "honors": "honors",
    "honours": "honours",

    "positionsofresponsibility": "positions of responsibility",
    "positionsofresponsibilities": "positions of responsibilities",
    "positionofresponsibility": "position of responsibility",
    "leadership": "leadership",
    "leadershipexperience": "leadership experience",
    "responsibilities": "responsibilities",

    "extracurricularactivities": "extracurricular activities",
    "extracurricular": "extracurricular",
    "extracurricularactivities": "extracurricular activities",
    "extracurricular": "extracurricular",

    "relevantcourses": "relevant courses",
    "relevantcoursework": "relevant coursework",
    "coursework": "coursework",
    "academiccourses": "academic courses",
}


# ============================================================
# Common patterns
# ============================================================

DATE_PATTERN = (
    r"(?:"
    r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)"
    r"[a-z]*[’']?\d{2,4}"
    r"|"
    r"(?:19|20)\d{2}"
    r")"
)

DATE_RANGE_PATTERN = (
    rf"({DATE_PATTERN})"
    r"\s*(?:[-–—]|to)\s*"
    rf"({DATE_PATTERN}|present|current)"
)


# ============================================================
# Text normalization
# ============================================================

def normalize_text(text: str) -> str:
    """
    Normalize PDF/DOCX extracted text while preserving lines.

    Important:
    We intentionally do NOT remove newlines because resume
    section detection depends heavily on line boundaries.
    """

    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    # Replace common PDF artifacts
    text = text.replace("\u00a0", " ")
    text = text.replace("\u200b", "")
    text = text.replace("\ufeff", "")

    lines = []

    for line in text.splitlines():
        line = line.strip()

        if not line:
            continue

        # Collapse repeated whitespace
        line = re.sub(r"[ \t]+", " ", line)

        # Normalize bullets
        line = re.sub(r"^[•▪●◦‣⁃]+\s*", "• ", line)

        lines.append(line)

    return "\n".join(lines)


# ============================================================
# PDF Extraction
# ============================================================

def extract_text_from_pdf(
    file_path: Path,
) -> str:
    from pypdf import PdfReader

    reader = PdfReader(str(file_path))

    pages = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            pages.append(text)

    return "\n".join(pages).strip()


# ============================================================
# DOCX Extraction
# ============================================================

def extract_text_from_docx(
    file_path: Path,
) -> str:
    from docx import Document

    document = Document(str(file_path))

    paragraphs = []

    for paragraph in document.paragraphs:
        text = paragraph.text.strip()

        if text:
            paragraphs.append(text)

    # Also capture text inside tables.
    for table in document.tables:
        for row in table.rows:
            cells = []

            for cell in row.cells:
                value = cell.text.strip()

                if value:
                    cells.append(value)

            if cells:
                paragraphs.append(" | ".join(cells))

    return "\n".join(paragraphs).strip()


# ============================================================
# Resume File Text Extraction
# ============================================================

def extract_resume_text(
    file_path: Path,
    file_type: str,
) -> str:

    extension = file_path.suffix.lower()

    if extension == ".pdf":
        return extract_text_from_pdf(file_path)

    if extension == ".docx":
        return extract_text_from_docx(file_path)

    raise ValueError(
        "Unsupported resume file format. "
        "Only PDF and DOCX are currently supported."
    )


# ============================================================
# Utility Functions
# ============================================================

def clean_text(value: str | None) -> str | None:
    if value is None:
        return None

    value = value.replace("\u00a0", " ")
    value = re.sub(r"\s+", " ", value)
    value = value.strip()

    return value or None


def clean_bullet(value: str) -> str:
    value = re.sub(
        r"^[•▪●◦‣⁃\-–—*]+\s*",
        "",
        value,
    )

    return clean_text(value) or ""


def normalize_heading(line: str) -> str:
    normalized = line.lower().strip()

    normalized = normalized.rstrip(":")
    normalized = normalized.replace("&", "and")

    # Remove bullet characters
    normalized = re.sub(
        r"^[•▪●◦‣⁃\-–—*]+\s*",
        "",
        normalized,
    )

    # Remove punctuation and spaces for compact matching
    compact = re.sub(
        r"[^a-z0-9]+",
        "",
        normalized,
    )

    if compact in HEADING_NORMALIZATION:
        return HEADING_NORMALIZATION[compact]

    return normalized


def compact_text(value: str) -> str:
    return re.sub(
        r"[^a-z0-9]+",
        "",
        value.lower(),
    )


def looks_like_bullet(line: str) -> bool:
    return bool(
        re.match(
            r"^\s*[•▪●◦‣⁃\-–—*]",
            line,
        )
    )


def looks_like_heading(line: str) -> bool:
    """
    Detect common resume headings.

    Works for:
    TECHNICAL SKILLS
    TECHNICALSKILLS
    Key Projects
    KEYPROJECTS
    """

    cleaned = line.strip()

    if not cleaned:
        return False

    normalized = normalize_heading(cleaned)

    for aliases in SECTION_ALIASES.values():
        for alias in aliases:
            if normalized == alias:
                return True

    compact = compact_text(cleaned)

    if compact in HEADING_NORMALIZATION:
        return True

    # Strong visual-heading heuristic
    alpha_chars = [
        char for char in cleaned
        if char.isalpha()
    ]

    if len(alpha_chars) >= 5:
        uppercase_ratio = sum(
            char.isupper()
            for char in alpha_chars
        ) / len(alpha_chars)

        if uppercase_ratio >= 0.85:
            if len(cleaned.split()) <= 8:
                return True

    return False


# ============================================================
# Email Extraction
# ============================================================

def extract_email(
    text: str,
) -> str | None:

    pattern = (
        r"\b[A-Za-z0-9._%+-]+"
        r"@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
    )

    match = re.search(
        pattern,
        text,
    )

    if match:
        return match.group(0).strip()

    return None


# ============================================================
# Phone Extraction
# ============================================================

def extract_phone(
    text: str,
) -> str | None:

    patterns = [
        r"\+\d{1,3}[\s\-()]?\d{3}[\s\-()]?\d{3}[\s\-()]?\d{4}",
        r"\+\d{1,3}[\s\-()]?\d{8,12}",
        r"\b\d{10}\b",
        r"\b\d{3}[\s\-]\d{3}[\s\-]\d{4}\b",
        r"\b\d{5}[\s\-]\d{5}\b",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            text,
        )

        if match:
            return clean_text(match.group(0))

    return None


# ============================================================
# Name Extraction
# ============================================================

def extract_name(
    text: str,
) -> str | None:

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    if not lines:
        return None

    # --------------------------------------------------------
    # 1. Strongest case:
    # Standalone uppercase name.
    # --------------------------------------------------------

    for line in lines[:8]:

        candidate = re.sub(
            r"[^A-Za-z\s'.-]",
            "",
            line,
        ).strip()

        words = candidate.split()

        if not (2 <= len(words) <= 4):
            continue

        if candidate.upper() != candidate:
            continue

        lowered = candidate.lower()

        blocked = {
            "department",
            "engineering",
            "undergraduate",
            "student",
            "resume",
            "curriculum vitae",
            "education",
            "experience",
            "skills",
        }

        if any(
            item in lowered
            for item in blocked
        ):
            continue

        return candidate.title()

    # --------------------------------------------------------
    # 2. Name after "Undergraduate", "Graduate", etc.
    # --------------------------------------------------------

    patterns = [
        r"(?:fourth|third|second|first)\s+year\s+"
        r"(?:undergraduate|student)\s+"
        r"([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){1,3})",

        r"(?:undergraduate|graduate|student)\s+"
        r"([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){1,3})",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE,
        )

        if match:
            candidate = clean_text(match.group(1))

            if candidate:
                return candidate

    # --------------------------------------------------------
    # 3. Look for a 2–4 word name near the top.
    # --------------------------------------------------------

    blocked_terms = {
        "fourth",
        "third",
        "second",
        "first",
        "year",
        "undergraduate",
        "graduate",
        "student",
        "department",
        "electrical",
        "engineering",
        "institute",
        "university",
        "college",
        "email",
        "phone",
        "linkedin",
        "github",
    }

    for line in lines[:10]:

        if any(
            char.isdigit()
            for char in line
        ):
            continue

        if "@" in line:
            continue

        candidate = re.sub(
            r"[^A-Za-z\s'.-]",
            "",
            line,
        ).strip()

        words = candidate.split()

        if not (2 <= len(words) <= 4):
            continue

        if any(
            word.lower() in blocked_terms
            for word in words
        ):
            continue

        return candidate.title()

    return None


# ============================================================
# Summary Extraction
# ============================================================

def extract_summary(
    text: str,
) -> str | None:

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    summary_aliases = SECTION_ALIASES["summary"]

    for index, line in enumerate(lines):

        normalized = normalize_heading(line)

        if normalized not in summary_aliases:
            continue

        summary_lines = []

        for next_line in lines[index + 1:]:
            if looks_like_heading(next_line):
                break

            summary_lines.append(
                clean_bullet(next_line)
            )

        if summary_lines:
            return clean_text(
                " ".join(summary_lines)
            )

    return None