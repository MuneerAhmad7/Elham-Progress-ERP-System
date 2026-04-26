from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, Text
from sqlalchemy.sql import func
from ..database import Base

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    company = Column(String)
    email = Column(String)
    phone = Column(String)
    source = Column(String)
    status = Column(String, default="New")
    score = Column(Integer, default=0)
    notes = Column(Text)
    assigned_to = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    company = Column(String)
    email = Column(String)
    phone = Column(String)
    address = Column(Text)
    contact_type = Column(String, default="Customer")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Opportunity(Base):
    __tablename__ = "opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    account_name = Column(String)
    amount = Column(Float, default=0)
    stage = Column(String, default="Qualification")
    probability = Column(Integer, default=0)
    close_date = Column(Date)
    description = Column(Text)
    assigned_to = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())