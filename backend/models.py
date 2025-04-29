from typing import Optional, List, Type
from enum import Enum
from uuid import UUID, uuid4
from typing import Annotated
from pydantic import BaseModel
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select, Relationship
from datetime import datetime, timedelta, timezone
class Gender(str, Enum):
    male = "Male"
    female = "Female"

class Role(str, Enum):
    patient = "Patient"
    doctor = "Doctor"
    neurologist = "Neurologist"
class UserBase(SQLModel):
    name: str
    username: str
    age: Optional[int] = None
    gender: Gender


class UserCreate(UserBase):
    password: str
    role: Role

"""

class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: str
    password: str
    age: Optional[int] = None
    password_hash: Optional[str] = None
    gender: Gender
    role: Role

"""
class User(UserBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    hashed_password: str
    role: Role
    # Relationships
    vitals: Optional["Vitals"] = Relationship(back_populates="user")

    lab_results: Optional["LabResult"] = Relationship(back_populates="user")
    """
    consultations: List["NeurologistConsultation"] = Relationship(back_populates="user")
    """



class UserPublic(UserBase):
    id: str
    role: Role


class UsersPublic(UserBase):
    users: List[UserPublic]

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None



class VitalsBase(SQLModel):
    chief_complaint: Optional[str] = Field(default=None, index=True)
    medical_history: Optional[str] = Field(default=None, index=True)
    blood_pressure_systolic: Optional[int] = Field(default=None, index=True)
    blood_pressure_diastolic: Optional[int] = Field(default=None, index=True)
    heart_rate: Optional[int] = Field(default=None, index=True)
    respiratory_rate: Optional[int] = Field(default=None, index=True)
    oxygen_saturation: Optional[int] = Field(default=None, index=True)

    # Exclusion criteria fields
    significant_head_trauma: Optional[bool] = Field(default=None, index=True)
    recent_surgery: Optional[bool] = Field(default=None, index=True)
    recent_myocardial_infarction: Optional[bool] = Field(default=None, index=True)
    recent_hemorrhage: Optional[bool] = Field(default=None, index=True)
    platelet_count: Optional[int] = Field(default=None, index=True)


class Vitals(VitalsBase, table=True):


    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id", unique=True,  nullable=False, ondelete="CASCADE")

    # Simulated Scores
    nihss_score: Optional[int] = Field(default=None, index=True)
    inr_score: Optional[float] = Field(default=None, index=True)

    user: Optional["User"] = Relationship(back_populates="vitals")

class VitalsCreate(VitalsBase):
    pass

class VitalsPublic(VitalsBase):
   pass





class LabResultBase(SQLModel):
    cbc: Optional[str] = Field(default=None, index=True)
    bmp_glucose: Optional[float] = Field(default=None, index=True)
    creatinine: Optional[float] = Field(default=None, index=True)
    coagulation: Optional[str] = Field(default=None, index=True)

class LabResultCreate(LabResultBase):
    pass

class LabResult(LabResultBase, table=True):
    id: str = Field(default_factory= lambda: str(uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    user: Optional["User"] = Relationship(back_populates="lab_results")

class LabResultPublic(LabResultBase):
    pass

class NeurologistConsultationBase(SQLModel):
    neurologist_notes: Optional[str] = Field(default=None, index=True)
    diagnosis: Optional[str] = Field(default=None, index=True)
    treatment_plan: Optional[str] = Field(default=None, index=True)

class NeurologistConsultation(NeurologistConsultationBase, table=True):


    id: str = Field(default_factory= lambda: str(uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")

    user: Optional["User"] = Relationship(back_populates="consultations")




class NeurologistConsultationCreate(NeurologistConsultationBase):
    pass


# Public Response Model (returned in API)
class NeurologistConsultationPublic(NeurologistConsultationBase):
    pass



