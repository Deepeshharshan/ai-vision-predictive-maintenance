from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str
    role: str = "operator"

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None

class UserInDBBase(UserBase):
    id: str # UUID as string
    role: str
    status: str
    created_at: datetime
    last_login: Optional[datetime] = None

    model_config = {"from_attributes": True}

class UserResponse(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    password_hash: str
