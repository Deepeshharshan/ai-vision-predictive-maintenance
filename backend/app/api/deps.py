from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError

from app.db.database import get_db
from app.auth.jwt import decode_access_token
from app.core.exceptions import CredentialsException, ForbiddenException
from app.models.user import User
from sqlalchemy import select

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: AsyncSession = Depends(get_db)
) -> User:
    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise CredentialsException()
    except JWTError:
        raise CredentialsException()
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise CredentialsException()
    return user

def require_role(allowed_roles: list[str]):
    async def role_checker(current_user: Annotated[User, Depends(get_current_user)]):
        if current_user.role not in allowed_roles:
            raise ForbiddenException()
        return current_user
    return role_checker
