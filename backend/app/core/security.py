from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import hashlib
import secrets
import hmac
from ..config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash using PBKDF2-HMAC-SHA256"""
    try:
        if ':' not in hashed_password:
            return False
        
        salt, stored_hash = hashed_password.split(':', 1)
        password_hash = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return hmac.compare_digest(password_hash.hex(), stored_hash)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Hash a password using PBKDF2-HMAC-SHA256"""
    try:
        salt = secrets.token_hex(32)
        password_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return f"{salt}:{password_hash.hex()}"
    except Exception as e:
        print(f"Password hashing error: {e}")
        raise ValueError(f"Error hashing password: {str(e)}")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_token(token: str):
    """Verify a JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError as e:
        print(f"Token verification error: {e}")
        return None

def generate_invitation_code() -> str:
    """Generate a secure invitation code"""
    return secrets.token_urlsafe(32)

def generate_reset_token() -> str:
    """Generate a secure password reset token"""
    return secrets.token_urlsafe(32)