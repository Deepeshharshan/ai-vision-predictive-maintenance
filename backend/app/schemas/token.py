from pydantic import BaseModel
from typing import Optional
from app.schemas.user import UserResponse

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None

class LoginResponse(BaseModel):
    token: str
    user: UserResponse
