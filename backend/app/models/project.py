from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    client = Column(String)
    description = Column(Text)
    status = Column(String, default="Active")
    progress = Column(Float, default=0)
    budget = Column(Float, default=0)
    spent = Column(Float, default=0)
    start_date = Column(Date)
    end_date = Column(Date)
    manager_id = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class BOQItem(Base):
    __tablename__ = "boq_items"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    item_number = Column(String)
    description = Column(String)
    unit = Column(String)
    quantity = Column(Float, default=0)
    rate = Column(Float, default=0)
    amount = Column(Float, default=0)
    status = Column(String, default="Pending")

class ProgressClaim(Base):
    __tablename__ = "progress_claims"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    claim_number = Column(String)
    date = Column(Date)
    amount = Column(Float, default=0)
    status = Column(String, default="Draft")
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())