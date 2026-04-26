from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.sql import func
from ..database import Base

class Account(Base):
    __tablename__ = "accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    parent_id = Column(Integer, nullable=True)
    balance = Column(Float, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class JournalEntry(Base):
    __tablename__ = "journal_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    entry_number = Column(String, unique=True)
    date = Column(Date, nullable=False)
    description = Column(Text)
    total_debit = Column(Float, default=0)
    total_credit = Column(Float, default=0)
    status = Column(String, default="Draft")
    created_by = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class JournalLine(Base):
    __tablename__ = "journal_lines"
    
    id = Column(Integer, primary_key=True, index=True)
    entry_id = Column(Integer, ForeignKey("journal_entries.id"))
    account_id = Column(Integer, ForeignKey("accounts.id"))
    debit = Column(Float, default=0)
    credit = Column(Float, default=0)
    description = Column(String)

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True)
    client_name = Column(String, nullable=False)
    date = Column(Date)
    due_date = Column(Date)
    subtotal = Column(Float, default=0)
    tax = Column(Float, default=0)
    total = Column(Float, default=0)
    paid = Column(Float, default=0)
    status = Column(String, default="Draft")
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InvoiceLine(Base):
    __tablename__ = "invoice_lines"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    description = Column(String)
    quantity = Column(Float, default=1)
    rate = Column(Float, default=0)
    amount = Column(Float, default=0)