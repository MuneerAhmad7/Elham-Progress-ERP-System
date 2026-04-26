from sqlalchemy.orm import Session
from ..models.user import User
from ..core.security import get_password_hash

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, username: str, email: str, password: str, full_name: str = None):
    db_user = User(
        username=username,
        email=email,
        hashed_password=get_password_hash(password),
        full_name=full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user