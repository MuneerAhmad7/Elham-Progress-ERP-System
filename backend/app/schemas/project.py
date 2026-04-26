from pydantic import BaseModel
from typing import Optional
from datetime import date

class ProjectCreate(BaseModel):
    name: str
    client: Optional[str] = None
    description: Optional[str] = None
    budget: float = 0
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    client: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[float] = None
    budget: Optional[float] = None
    spent: Optional[float] = None

class ProjectResponse(ProjectCreate):
    id: int
    status: str
    progress: float
    spent: float
    is_active: bool
    class Config:
        from_attributes = True