from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas.crm import LeadCreate, LeadUpdate, ContactCreate, OpportunityCreate
from ..models.crm import Lead, Contact, Opportunity
from ..dependencies.auth import get_current_user

router = APIRouter()

@router.get("/leads")
def get_leads(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Lead).all()

@router.post("/leads")
def create_lead(lead: LeadCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_lead = Lead(**lead.dict())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.put("/leads/{lead_id}")
def update_lead(lead_id: int, lead: LeadUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not db_lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    for key, value in lead.dict(exclude_unset=True).items():
        setattr(db_lead, key, value)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.get("/contacts")
def get_contacts(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Contact).all()

@router.post("/contacts")
def create_contact(contact: ContactCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_contact = Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.get("/opportunities")
def get_opportunities(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Opportunity).all()

@router.post("/opportunities")
def create_opportunity(opp: OpportunityCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_opp = Opportunity(**opp.dict())
    db.add(db_opp)
    db.commit()
    db.refresh(db_opp)
    return db_opp