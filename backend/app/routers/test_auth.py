from fastapi import APIRouter, Depends

from app.models.user import User
from app.routers.auth import (
    get_current_user,
    require_candidate,
    require_recruiter,
)


router = APIRouter(
    prefix="/test-auth",
    tags=["Authorization Tests"],
)


@router.get("/authenticated")
def authenticated_route(
    current_user: User = Depends(get_current_user),
):
    return {
        "message": "You are authenticated",
        "user_id": str(current_user.id),
        "role": current_user.role.value,
    }


@router.get("/recruiter-only")
def recruiter_only_route(
    current_user: User = Depends(require_recruiter),
):
    return {
        "message": "You have recruiter access",
        "user_id": str(current_user.id),
        "role": current_user.role.value,
    }


@router.get("/candidate-only")
def candidate_only_route(
    current_user: User = Depends(require_candidate),
):
    return {
        "message": "You have candidate access",
        "user_id": str(current_user.id),
        "role": current_user.role.value,
    }