import uuid

from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.candidate import Candidate
from app.models.recruiter import Recruiter
from app.models.user import User, UserRole


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    """
    Retrieve a user by email address.
    """
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def get_user_by_id(
    db: Session,
    user_id: uuid.UUID,
) -> User | None:
    """
    Retrieve a user by ID.
    """
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def create_user(
    db: Session,
    email: str,
    password: str,
    role: UserRole,
) -> User:
    """
    Create a user with a securely hashed password.
    """
    user = User(
        email=email,
        password_hash=hash_password(password),
        role=role,
    )

    db.add(user)
    db.flush()

    return user


def create_recruiter_profile(
    db: Session,
    user_id: uuid.UUID,
    company_name: str = "Not specified",
) -> Recruiter:
    """
    Create a recruiter profile linked to a user.
    """
    recruiter = Recruiter(
        user_id=user_id,
        company_name=company_name,
    )

    db.add(recruiter)
    db.flush()

    return recruiter


def create_candidate_profile(
    db: Session,
    user_id: uuid.UUID,
    first_name: str = "Candidate",
    last_name: str = "User",
) -> Candidate:
    """
    Create a candidate profile linked to a user.
    """
    candidate = Candidate(
        user_id=user_id,
        first_name=first_name,
        last_name=last_name,
    )

    db.add(candidate)
    db.flush()

    return candidate


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User | None:
    """
    Verify login credentials.

    Returns the user if credentials are valid.
    """
    user = get_user_by_email(db, email)

    if not user:
        return None

    if not user.is_active:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user


def generate_user_token(user: User) -> str:
    """
    Generate a JWT token for an authenticated user.
    """
    return create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role.value,
        }
    )