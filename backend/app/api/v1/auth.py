from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.core.config import settings
from app.core.security import verify_password
from app.auth.jwt import create_access_token
from app.models.user import User
from app.schemas.token import LoginResponse
from app.schemas.user import UserResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
async def login_access_token(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user.id),
        role=user.role,
        expires_delta=access_token_expires
    )
    return {
        "token": access_token,
        "user": user
    }

@router.get("/verify", response_model=UserResponse)
async def verify_token(
    current_user: User = Depends(get_current_user)
) -> Any:
    return current_user

@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user)
) -> Any:
    # In a stateless JWT setup, logout is typically handled by the client
    # clearing the cookie/token. We provide this endpoint for completeness.
    return {"message": "Successfully logged out"}
