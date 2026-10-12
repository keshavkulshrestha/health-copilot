from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None
    age: Optional[int] = Field(None, ge=0, le=130)
    gender: Optional[str] = None
    blood_group: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = Field(None, ge=0, le=130)
    gender: Optional[str] = None
    blood_group: Optional[str] = None

class PreferenceUpdate(BaseModel):
    language: Optional[str] = Field(None, pattern="^(en|hi)$")
    theme: Optional[str] = Field(None, pattern="^(light|dark)$")
    summary_depth: Optional[str] = None

class UserPreferenceResponse(BaseModel):
    language: str
    theme: str
    summary_depth: str

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    is_active: bool
    created_at: datetime
    preference: Optional[UserPreferenceResponse] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
