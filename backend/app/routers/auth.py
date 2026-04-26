from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from typing import Optional  # Add this if not already present
from pydantic import BaseModel, EmailStr  # Make sure these are imported

from ..database import get_db
from ..schemas.auth import (
    UserCreate, UserResponse, Token, InvitationCreate, 
    InvitationResponse, PasswordResetRequest, PasswordResetConfirm,
    PermissionsResponse
)
from ..models.user import User, Invitation, PasswordReset
from ..core.security import (
    verify_password, get_password_hash, create_access_token,
    generate_invitation_code, generate_reset_token
)
from ..dependencies.auth import get_current_user
from ..config import settings

router = APIRouter()

# Role-based permissions
ROLE_PERMISSIONS = {
    "ceo": {
        "modules": ["dashboard", "employees", "attendance", "leaves", "payroll", 
                   "accounts", "journal", "invoices", "reports", "leads", "contacts", 
                   "opportunities", "projects", "tasks", "taskboard", "settings"],
        "can_invite": True,
        "can_manage_users": True
    },
    "hr_manager": {
        "modules": ["dashboard", "employees", "attendance", "leaves", "payroll"],
        "can_invite": True,
        "can_manage_users": False
    },
    "accountant": {
        "modules": ["dashboard", "accounts", "journal", "invoices", "reports"],
        "can_invite": False,
        "can_manage_users": False
    },
    "project_manager": {
        "modules": ["dashboard", "projects", "tasks", "taskboard"],
        "can_invite": False,
        "can_manage_users": False
    },
    "employee": {
        "modules": ["dashboard", "tasks", "taskboard"],
        "can_invite": False,
        "can_manage_users": False
    }
}

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Check invitation code if provided
    role = "employee"
    department = None
    
    if user.invitation_code:
        invitation = db.query(Invitation).filter(
            Invitation.code == user.invitation_code,
            Invitation.status == "pending"
        ).first()
        
        if not invitation:
            raise HTTPException(status_code=400, detail="Invalid or expired invitation code")
        
        if invitation.email.lower() != user.email.lower():
            raise HTTPException(status_code=400, detail="Invitation email does not match")
        
        if invitation.expires_at < datetime.utcnow():
            invitation.status = "expired"
            db.commit()
            raise HTTPException(status_code=400, detail="Invitation has expired")
        
        role = invitation.role
        department = invitation.department
        
        # Mark invitation as used
        invitation.status = "accepted"
        invitation.used_at = datetime.utcnow()
        db.commit()
    
    # Create user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password,
        role=role,
        department=department
    )
    
    # First user is CEO
    if db.query(User).count() == 0:
        db_user.role = "ceo"
        db_user.is_superuser = True
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="User account is deactivated")
    
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/permissions", response_model=PermissionsResponse)
def get_permissions(current_user: User = Depends(get_current_user)):
    permissions = ROLE_PERMISSIONS.get(current_user.role, ROLE_PERMISSIONS["employee"])
    return permissions

@router.post("/invite", response_model=InvitationResponse)
def create_invitation(
    invitation: InvitationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has permission to invite
    permissions = ROLE_PERMISSIONS.get(current_user.role, {})
    if not permissions.get("can_invite", False):
        raise HTTPException(status_code=403, detail="You don't have permission to invite users")
    
    # Check if email is already registered
    if db.query(User).filter(User.email == invitation.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check for existing pending invitation
    existing = db.query(Invitation).filter(
        Invitation.email == invitation.email,
        Invitation.status == "pending"
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Invitation already sent to this email")
    
    # Generate invitation code
    code = generate_invitation_code()
    
    # Create invitation
    db_invitation = Invitation(
        email=invitation.email,
        code=code,
        role=invitation.role,
        department=invitation.department,
        invited_by=current_user.id,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    
    db.add(db_invitation)
    db.commit()
    db.refresh(db_invitation)
    
    # TODO: Send email with invitation link
    # send_invitation_email(invitation.email, code)
    
    return db_invitation

@router.get("/invitations", response_model=list[InvitationResponse])
def list_invitations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    permissions = ROLE_PERMISSIONS.get(current_user.role, {})
    if not permissions.get("can_invite", False):
        raise HTTPException(status_code=403, detail="Access denied")
    
    invitations = db.query(Invitation).filter(
        Invitation.invited_by == current_user.id
    ).order_by(Invitation.created_at.desc()).all()
    
    return invitations

@router.post("/forgot-password")
def forgot_password(request: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        # Don't reveal if email exists
        return {"message": "If the email exists, a reset link has been sent"}
    
    # Generate reset token
    token = generate_reset_token()
    
    # Create password reset record
    reset = PasswordReset(
        email=request.email,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=1)
    )
    
    db.add(reset)
    db.commit()
    
    # TODO: Send email with reset link
    # send_reset_email(request.email, token)
    
    return {"message": "If the email exists, a reset link has been sent"}

@router.post("/reset-password")
def reset_password(reset: PasswordResetConfirm, db: Session = Depends(get_db)):
    # Find reset token
    reset_record = db.query(PasswordReset).filter(
        PasswordReset.token == reset.token,
        PasswordReset.used == False
    ).first()
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    if reset_record.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    # Find user
    user = db.query(User).filter(User.email == reset_record.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update password
    user.hashed_password = get_password_hash(reset.new_password)
    reset_record.used = True
    
    db.commit()
    
    return {"message": "Password reset successfully"}

@router.get("/verify-invitation/{code}")
def verify_invitation(code: str, db: Session = Depends(get_db)):
    invitation = db.query(Invitation).filter(
        Invitation.code == code,
        Invitation.status == "pending"
    ).first()
    
    if not invitation:
        raise HTTPException(status_code=404, detail="Invalid invitation code")
    
    if invitation.expires_at < datetime.utcnow():
        invitation.status = "expired"
        db.commit()
        raise HTTPException(status_code=400, detail="Invitation has expired")
    
    return {
        "email": invitation.email,
        "role": invitation.role,
        "department": invitation.department,
        "valid": True
    }
    # ... existing code ...

@router.get("/verify-invitation/{code}")
def verify_invitation(code: str, db: Session = Depends(get_db)):
    # ... existing verify_invitation code ...
    return {
        "email": invitation.email,
        "role": invitation.role,
        "department": invitation.department,
        "valid": True
    }

# ✅ ADD THESE NEW ROUTES HERE (BEFORE THE END OF FILE)

@router.put("/update-profile", response_model=UserResponse)
def update_profile(
    full_name: Optional[str] = None,
    email: Optional[EmailStr] = None,
    department: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if full_name:
        current_user.full_name = full_name
    if email and email != current_user.email:
        # Check if email already exists
        existing = db.query(User).filter(User.email == email, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = email
    if department:
        current_user.department = department
    
    db.commit()
    db.refresh(current_user)
    return current_user

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@router.post("/change-password")
def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Update password
    current_user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}