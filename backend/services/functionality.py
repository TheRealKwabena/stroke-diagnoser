import uuid

from typing import Optional, List, Any

from sqlmodel import Field, Relationship, SQLModel, create_engine, Session, select

from models.models import Patient, PatientPublic, PatientCreate, PatientUpdate, PatientsPublic, Vitals, VitalsCreate, VitalsPublic, NeurologistConsultation, NeurologistConsultationCreate, NeurologistConsultationBase
from database import SessionDep
from fastapi import Depends, HTTPException, APIRouter

from uuid import UUID

def create_patient(*, patient: PatientCreate, session: SessionDep):
    db_patient = Patient.model_validate(patient)
    session.add(db_patient)
    session.commit()
    session.refresh(db_patient)
    return db_patient

def createVitals(*, vitals: VitalsCreate, session: SessionDep, patient_id: UUID, ):

    db_vitals = Vitals.model_validate(vitals, update={"patient_id": patient_id})
    
    session.add(db_vitals)
    session.commit()
    session.refresh(db_vitals)
    return db_vitals
def get_patient_by_id(patient_id: UUID, session: SessionDep) -> PatientPublic:
    patient = session.exec(select(Patient).where(Patient.id == patient_id)).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


def get_patients(session: SessionDep, skip: int = 0, limit: int = 100) -> PatientsPublic:
    patients = session.exec(select(Patient).offset(skip).limit(limit)).all()
    return patients

def create_consultations(*, consultation: NeurologistConsultationCreate, session: SessionDep, patient_id: UUID):
    db_consultation = NeurologistConsultation.model_validate(consultation, update={"patient_id": patient_id})
    session.add(db_consultation)
    session.commit()
    session.refresh(db_consultation)
    return db_consultation

def get_vitals_by_patient_id(patient_id: UUID, session: SessionDep) -> VitalsPublic:
    vitals = session.exec(select(Vitals).where(Vitals.patient_id == patient_id)).all()
    if not vitals:
        raise HTTPException(status_code=404, detail="Vitals not found")
    return vitals


