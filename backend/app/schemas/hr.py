from pydantic import BaseModel
from typing import Optional
from datetime import date

class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    salary: Optional[float] = 0

class EmployeeCreate(EmployeeBase):
    hire_date: Optional[date] = None

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    salary: Optional[float] = None
    is_active: Optional[bool] = None

class EmployeeResponse(EmployeeBase):
    id: int
    is_active: bool
    hire_date: Optional[date] = None
    
    class Config:
        from_attributes = True

class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    status: str = "Present"

class LeaveCreate(BaseModel):
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date
    reason: Optional[str] = None

class LeaveUpdate(BaseModel):
    status: str