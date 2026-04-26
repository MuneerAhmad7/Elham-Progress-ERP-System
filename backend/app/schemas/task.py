from pydantic import BaseModel
from typing import Optional
from datetime import date

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: Optional[int] = None
    assigned_to: Optional[int] = None
    priority: str = "Medium"
    due_date: Optional[date] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[int] = None

class TaskResponse(TaskCreate):
    id: int
    status: str
    class Config:
        from_attributes = True