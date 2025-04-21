"""

import uuid


from fastapi import APIRouter, HTTPException, Depends

from sqlmodel import Field, Relationship, SQLModel, create_engine, Session, select
from typing import Optional, List
from uuid import UUID




## Defining the Patient model with SQLModel
class PatientBase(SQLModel):
    name: str = Field(index=True, nullable=False)
    age: int | None = Field(default= None, index=True)
    sex: str = Field(index=True)
    chief_complaint: str | None = Field(default=None, index=True)
    medical_history: str | None = Field(default=None, index=True)
    nihss_score: int | None = Field(default=None, index=True)

class Patient(PatientBase, table=True):
    __tablename__ = "patients"
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    vitals: Optional["Vitals"] = Relationship(back_populates="patient", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    lab_results: Optional["LabResults"] = Relationship(back_populates="patient", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    neurologist_consultation: Optional["NeurologistConsultation"] = Relationship(back_populates="patient", sa_relationship_kwargs={"cascade": "all, delete-orphan"})

    # Add any additional fields or relationships here if needed
    # Example: relationships with other models

class PatientPublic(PatientBase):
    id: UUID

    class Config:
        orm_mode = True


class PatientCreate(PatientBase):
    pass


#Abstraction that allows us to update the patient model
class PatientUpdate(PatientBase):
    name: Optional[str] = None
    age: Optional[int] = None
    sex: Optional[str] = None


class PatientsPublic(PatientBase):
    patients: List[PatientPublic]
    count : int




class VitalsBase(SQLModel):
    patient_id: UUID = Field(foreign_key="patients.id")
    blood_pressure_systolic: int | None = Field(default=None, index=True)
    blodd_pressure_diastolic: int | None = Field(default=None, index=True)
    heart_rate: int | None = Field(default=None, index=True)
    respiratory_rate: int | None = Field(default=None, index=True)
    oxygen_saturation: int | None = Field(default=None, index=True)
    significant_head_trauma: bool | None = Field(default=None, index=True)
    recent_surgery: bool | None = Field(default=None, index=True)
    recent_myocardial_infarction: bool | None = Field(default=None, index=True)
    recent_hemorrhage: bool | None = Field(default=None, index=True)
    platelet_count: int | None = Field(default=None, index=True)
    cbc: str | None = Field(default=None, index=True)
    bmp_glucose: float | None = Field(default=None, index=True)
    creatinine: float | None = Field(default=None, index=True)
    coagulation: str | None = Field(default=None, index=True)


    #Relationship with Patient model
    patient: Optional["Patient"] = Relationship(back_populates="vitals")

class Vitals(VitalsBase, table=True):
    __tablename__ = "vitals"
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: UUID = Field(foreign_key="patients.id", nullable=False, ondelete="CASCADE")
    patient: Optional["Patient"] = Relationship(back_populates="vitals")
class VitalsCreate(VitalsBase):
    pass

class VitalsPublic(VitalsBase):
    pass



class LabResultBase(SQLModel):
   
    patient_id: UUID = Field(foreign_key="patients.id")
    cbc: str | None = Field(default=None, index=True)
    bmp_glucose: float | None = Field(default=None, index=True)
    creatinine: float | None = Field(default=None, index=True)
    coagulation: str | None = Field(default=None, index=True)
    

    #Relationship with Patient model
    patient: Optional["Patient"] = Relationship(back_populates="lab_results")


class LabResults(LabResultBase, table=True):
    __tablename__ = "lab_results"
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: UUID = Field(foreign_key="patients.id", nullable=False, ondelete="CASCADE")
    patient: Optional["Patient"] = Relationship(back_populates="lab_results")

class LabResultsPublic(LabResultBase):
    pass



class AllReportData(SQLModel):
    patient_id: UUID = Field(foreign_key="patients.id")
    blood_pressure_systolic: int | None = Field(default=None, index=True)
    blodd_pressure_diastolic: int | None = Field(default=None, index=True)
    heart_rate: int | None = Field(default=None, index=True)
    respiratory_rate: int | None = Field(default=None, index=True)
    oxygen_saturation: int | None = Field(default=None, index=True)
    significant_head_trauma: bool | None = Field(default=None, index=True)
    recent_surgery: bool | None = Field(default=None, index=True)
    recent_myocardial_infarction: bool | None = Field(default=None, index=True)
    recent_hemorrhage: bool | None = Field(default=None, index=True)
    platelet_count: int | None = Field(default=None, index=True)
    cbc: str | None = Field(default=None, index=True)
    bmp_glucose: float | None = Field(default=None, index=True)
    creatinine: float | None = Field(default=None, index=True)
    coagulation: str | None = Field(default=None, index=True)

class NeurologistConsultationBase(SQLModel):
    patient_id: UUID = Field(foreign_key="patients.id")
    neurologist_notes: str | None = Field(default=None, index=True)
    diagnosis: str | None = Field(default=None, index=True)
    treatment_plan: str | None = Field(default=None, index=True)



class NeurologistConsultation(NeurologistConsultationBase, table=True):
    __tablename__ = "neurologist_consultation"
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: UUID = Field(foreign_key="patients.id", nullable=False, ondelete="CASCADE")
    patient: Optional["Patient"] = Relationship(back_populates="neurologist_consultation")


class NeurologistConsultationCreate(NeurologistConsultationBase):
    pass

    

    """

import uuid
from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Field, Relationship, SQLModel, create_engine, Session, select

# ------------------ Patient Model ------------------
class PatientBase(SQLModel):
    name: str = Field(index=True, nullable=False)
    age: Optional[int] = Field(default=None, index=True)
    sex: str = Field(index=True)
    chief_complaint: Optional[str] = Field(default=None, index=True)
    medical_history: Optional[str] = Field(default=None, index=True)
    nihss_score: Optional[int] = Field(default=None, index=True)

class Patient(PatientBase, table=True):
    __tablename__ = "patients"
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    vitals: List["Vitals"] = Relationship(back_populates="patient", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    lab_results: List["LabResults"] = Relationship(back_populates="patient", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    neurologist_consultation: Optional["NeurologistConsultation"] = Relationship(back_populates="patient", sa_relationship_kwargs={"cascade": "all, delete-orphan"})

class PatientPublic(PatientBase):
    id: UUID

    class Config:
        from_attributes = True

class PatientCreate(PatientBase):
    pass

class PatientUpdate(SQLModel):
    name: Optional[str] = None
    age: Optional[int] = None
    sex: Optional[str] = None

class PatientsPublic(SQLModel):
    patients: List[PatientPublic]
    count: int

# ------------------ Vitals Model ------------------
class VitalsBase(SQLModel):
    patient_id: UUID = Field(foreign_key="patients.id")
    blood_pressure_systolic: Optional[int] = Field(default=None, index=True)
    blodd_pressure_diastolic: Optional[int] = Field(default=None, index=True)
    heart_rate: Optional[int] = Field(default=None, index=True)
    respiratory_rate: Optional[int] = Field(default=None, index=True)
    oxygen_saturation: Optional[int] = Field(default=None, index=True)
    significant_head_trauma: Optional[bool] = Field(default=None, index=True)
    recent_surgery: Optional[bool] = Field(default=None, index=True)
    recent_myocardial_infarction: Optional[bool] = Field(default=None, index=True)
    recent_hemorrhage: Optional[bool] = Field(default=None, index=True)
    platelet_count: Optional[int] = Field(default=None, index=True)
    cbc: Optional[str] = Field(default=None, index=True)
    bmp_glucose: Optional[float] = Field(default=None, index=True)
    creatinine: Optional[float] = Field(default=None, index=True)
    coagulation: Optional[str] = Field(default=None, index=True)

class Vitals(VitalsBase, table=True):
    __tablename__ = "vitals"
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: UUID = Field(foreign_key="patients.id", nullable=False)
    patient: Optional["Patient"] = Relationship(back_populates="vitals")

class VitalsCreate(VitalsBase):
    pass

class VitalsPublic(VitalsBase):
    pass

# ------------------ Lab Results Model ------------------
class LabResultBase(SQLModel):
    patient_id: UUID = Field(foreign_key="patients.id")
    cbc: Optional[str] = Field(default=None, index=True)
    bmp_glucose: Optional[float] = Field(default=None, index=True)
    creatinine: Optional[float] = Field(default=None, index=True)
    coagulation: Optional[str] = Field(default=None, index=True)

class LabResults(LabResultBase, table=True):
    __tablename__ = "lab_results"
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: UUID = Field(foreign_key="patients.id", nullable=False)
    patient: Optional["Patient"] = Relationship(back_populates="lab_results")

class LabResultsPublic(LabResultBase):
    pass

# ------------------ All Report Data (Read-only composite) ------------------
class AllReportData(SQLModel):
    patient_id: UUID = Field(foreign_key="patients.id")
    blood_pressure_systolic: Optional[int] = Field(default=None, index=True)
    blodd_pressure_diastolic: Optional[int] = Field(default=None, index=True)
    heart_rate: Optional[int] = Field(default=None, index=True)
    respiratory_rate: Optional[int] = Field(default=None, index=True)
    oxygen_saturation: Optional[int] = Field(default=None, index=True)
    significant_head_trauma: Optional[bool] = Field(default=None, index=True)
    recent_surgery: Optional[bool] = Field(default=None, index=True)
    recent_myocardial_infarction: Optional[bool] = Field(default=None, index=True)
    recent_hemorrhage: Optional[bool] = Field(default=None, index=True)
    platelet_count: Optional[int] = Field(default=None, index=True)
    cbc: Optional[str] = Field(default=None, index=True)
    bmp_glucose: Optional[float] = Field(default=None, index=True)
    creatinine: Optional[float] = Field(default=None, index=True)
    coagulation: Optional[str] = Field(default=None, index=True)

# ------------------ Neurologist Consultation Model ------------------
class NeurologistConsultationBase(SQLModel):
    patient_id: UUID = Field(foreign_key="patients.id")
    neurologist_notes: Optional[str] = Field(default=None, index=True)
    diagnosis: Optional[str] = Field(default=None, index=True)
    treatment_plan: Optional[str] = Field(default=None, index=True)

class NeurologistConsultation(NeurologistConsultationBase, table=True):
    __tablename__ = "neurologist_consultation"
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: UUID = Field(foreign_key="patients.id", nullable=False)
    patient: Optional["Patient"] = Relationship(back_populates="neurologist_consultation")

class NeurologistConsultationCreate(NeurologistConsultationBase):
    pass

# Resolve all forward references
Patient.update_forward_refs()
Vitals.update_forward_refs()
LabResults.update_forward_refs()
NeurologistConsultation.update_forward_refs()
