from fastapi import FastAPI


app = FastAPI(
    title="HireAI API",
    description="AI-Based Candidate Evaluation Platform",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "HireAI API is running",
        "status": "ok",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }