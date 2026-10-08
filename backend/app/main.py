from fastapi import FastAPI

from app.routers.auth import router as auth_router
from app.routers.jobs import router as jobs_router
from app.routers.test_auth import router as test_auth_router
from app.routers.applications import router as applications_router
from app.routers.resumes import router as resumes_router
from app.routers.resume_processing import (router as resume_processing_router,)
from app.routers.job_requirements import router as job_requirements_router

app = FastAPI(
    title="HireAI API",
    description="AI-Based Candidate Evaluation Platform",
    version="1.0.0",
)


app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(test_auth_router)
app.include_router(applications_router)
app.include_router(resumes_router)
app.include_router(resume_processing_router)
app.include_router(job_requirements_router)


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