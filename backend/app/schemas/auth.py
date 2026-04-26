from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    invitation_code: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    role: str
    department: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class InvitationCreate(BaseModel):
    email: EmailStr
    role: str
    department: Optional[str] = None

class InvitationResponse(BaseModel):
    id: int
    email: str
    code: str
    role: str
    department: Optional[str]
    status: str
    expires_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class PermissionsResponse(BaseModel):
    modules: List[str]
    can_invite: bool
    can_manage_users: bool