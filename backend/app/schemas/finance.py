from pydantic import BaseModel
from typing import Optional
from datetime import date

class AccountCreate(BaseModel):
    code: str
    name: str
    type: str
    balance: float = 0

class AccountResponse(AccountCreate):
    id: int
    is_active: bool
    class Config:
        from_attributes = True

class JournalEntryCreate(BaseModel):
    date: date
    description: str

class InvoiceCreate(BaseModel):
    client_name: str
    date: date
    due_date: date
    notes: Optional[str] = None