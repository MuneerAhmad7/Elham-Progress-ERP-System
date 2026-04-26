from pydantic import BaseModel
from typing import Optional
from datetime import date

class LeadCreate(BaseModel):
    name: str
    company: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = None
    score: Optional[int] = None

class ContactCreate(BaseModel):
    name: str
    company: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    contact_type: str = "Customer"

class OpportunityCreate(BaseModel):
    name: str
    account_name: Optional[str] = None
    amount: float = 0
    stage: str = "Qualification"
    close_date: Optional[date] = None
    description: Optional[str] = None