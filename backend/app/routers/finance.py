from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas.finance import AccountCreate, AccountResponse, JournalEntryCreate, InvoiceCreate
from ..models.finance import Account, JournalEntry, JournalLine, Invoice, InvoiceLine
from ..dependencies.auth import get_current_user

router = APIRouter()

@router.get("/accounts", response_model=List[AccountResponse])
def get_accounts(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Account).all()

@router.post("/accounts", response_model=AccountResponse)
def create_account(account: AccountCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_acc = Account(**account.dict())
    db.add(db_acc)
    db.commit()
    db.refresh(db_acc)
    return db_acc

@router.get("/journal-entries")
def get_journal_entries(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(JournalEntry).all()

@router.post("/journal-entries")
def create_journal_entry(entry: JournalEntryCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    count = db.query(JournalEntry).count()
    db_entry = JournalEntry(
        entry_number=f"JE-{count+1:03d}",
        date=entry.date,
        description=entry.description
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/invoices")
def get_invoices(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Invoice).all()

@router.post("/invoices")
def create_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    count = db.query(Invoice).count()
    db_inv = Invoice(
        invoice_number=f"INV-{count+1001}",
        client_name=invoice.client_name,
        date=invoice.date,
        due_date=invoice.due_date,
        notes=invoice.notes
    )
    db.add(db_inv)
    db.commit()
    db.refresh(db_inv)
    return db_inv

@router.get("/reports")
def get_reports(current_user = Depends(get_current_user)):
    return {"message": "Reports endpoint ready"}