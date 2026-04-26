from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas.hr import EmployeeCreate, EmployeeUpdate, EmployeeResponse, AttendanceCreate, LeaveCreate, LeaveUpdate
from ..models.hr import Employee, Attendance, Leave, Payroll
from ..dependencies.auth import get_current_user

router = APIRouter()

# Employees
@router.get("/employees", response_model=List[EmployeeResponse])
def get_employees(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Employee).all()

@router.post("/employees", response_model=EmployeeResponse)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_emp = Employee(**employee.dict())
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)
    return db_emp

@router.put("/employees/{employee_id}", response_model=EmployeeResponse)
def update_employee(employee_id: int, employee: EmployeeUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    for key, value in employee.dict(exclude_unset=True).items():
        setattr(db_emp, key, value)
    db.commit()
    db.refresh(db_emp)
    return db_emp

@router.delete("/employees/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(db_emp)
    db.commit()
    return {"message": "Employee deleted"}

# Attendance
@router.get("/attendance")
def get_attendance(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Attendance).all()

@router.post("/attendance")
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_att = Attendance(**attendance.dict())
    db.add(db_att)
    db.commit()
    db.refresh(db_att)
    return db_att


@router.put("/attendance/{attendance_id}")
def update_attendance(
    attendance_id: int,
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_att = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not db_att:
        raise HTTPException(status_code=404, detail="Attendance not found")
    
    for key, value in attendance_data.dict().items():
        setattr(db_att, key, value)
    
    db.commit()
    db.refresh(db_att)
    return db_att

# Leaves
@router.get("/leaves")
def get_leaves(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Leave).all()

@router.post("/leaves")
def create_leave(leave: LeaveCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_leave = Leave(**leave.dict())
    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)
    return db_leave

@router.put("/leaves/{leave_id}")
def update_leave(leave_id: int, leave: LeaveUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_leave = db.query(Leave).filter(Leave.id == leave_id).first()
    if not db_leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    db_leave.status = leave.status
    db.commit()
    db.refresh(db_leave)
    return db_leave

# Payroll
@router.get("/payroll")
def get_payroll(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Payroll).all()