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
    vitals = Relationship(back_populates="patient", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    lab_results = Relationship(back_populates="patient", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    neurologist_consultation = Relationship(back_populates="patient", sa_relationship_kwargs={"cascade": "all, delete-orphan"})

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


"""
#Defining models for vitals
troke or serious head injury in the previous 3 months
* Intracranial hemorrhage, tumor, or arteriovenous malformation
* Recent myocardial infarction
* Systolic blood pressure > 185 mmHg or diastolic blood pressure > 110 mmHg
* Blood glucose < 50 mg/dL or >400 mg/dL
* Use of anticoagulants with elevated INR >=3 causes bleeding
* Platelet count < 100,000/μL
* Recent surgery or biopsy of a parenchymal organ


"""

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
    patient: Optional[Patient] = Relationship(back_populates="vitals")

class Vitals(VitalsBase, table=True):
    __tablename__ = "vitals"
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: UUID = Field(foreign_key="patients.id", nullable=False, ondelete="CASCADE")
    patient: Optional[Patient] = Relationship(back_populates="vitals")
class VitalsCreate(VitalsBase):
    pass

class VitalsPublic(VitalsBase):
    pass

"""
id	Integer	Primary key
patient_id	Integer	Foreign key to Patient
cbc	String	Result summary for Complete Blood Count (e.g., "normal")
bmp_glucose	Float	Glucose level in mg/dL (from Basic Metabolic Panel)
creatinine	Float	Kidney function marker (mg/dL)
coagulation	String	Summary of coagulation test results (e.g., "normal")
"""

class LabResultBase(SQLModel):
   
    patient_id: UUID = Field(foreign_key="patients.id")
    cbc: str | None = Field(default=None, index=True)
    bmp_glucose: float | None = Field(default=None, index=True)
    creatinine: float | None = Field(default=None, index=True)
    coagulation: str | None = Field(default=None, index=True)
    

    #Relationship with Patient model
    patient: Optional[Patient] = Relationship(back_populates="lab_results")


class LabResults(LabResultBase, table=True):
    __tablename__ = "lab_results"
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: UUID = Field(foreign_key="patients.id", nullable=False, ondelete="CASCADE")
    patient: Optional[Patient] = Relationship(back_populates="lab_results")

class LabResultsPublic(LabResultBase):
    pass


"""
patient_id	Integer	Foreign key to Patient
neurologist_notes	String	Free-form notes and observations
diagnosis	String	E.g., ischemic stroke, hemorrhagic stroke
treatment_plan	String	Instructions (e.g., tPA, admit to ICU)

"""
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
    patient: Optional[Patient] = Relationship(back_populates="neurologist_consultation")


class NeurologistConsultationCreate(NeurologistConsultationBase):
    pass