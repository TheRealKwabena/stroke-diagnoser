from fastapi import APIRouter

router = APIRouter(prefix="/patients", tags=["patients"])


from models.models import Patient, PatientCreate, PatientPublic, PatientsPublic
from database import SessionDep
from fastapi import Depends, HTTPException  
from sqlmodel import select, Session, delete, col, update, func

from services.functionality import create_patient, get_patient_by_id, get_patients, create_consultations, get_vitals_by_patient_id
from uuid import UUID
from typing import List, Optional
###API get requests for patients


@router.get("/", response_model=PatientsPublic, status_code=200)
async def get_all_patients(session: SessionDep, skip:int = 0, limit:int = 100):
    """
    Get all patients
    """
    count_statement = select(func.count()).select_from(Patient)
    count = session.exec(count_statement).one()

    statement = select(Patient).offset(skip).limit(limit)
    patients = session.exec(statement).all()

    
    return PatientsPublic(patients=patients, count=count)

@router.get("/{patient_id}", response_model=PatientPublic, status_code=200)
async def get_patient_by_id(*, patient_id: UUID, session: SessionDep) -> PatientPublic:
    """
    Get a patient by ID
    """
    patient = get_patient_by_id(patient_id, session)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/", response_model=PatientPublic, status_code=201)
async def create_patient(*, patient: PatientCreate, session: SessionDep) -> PatientPublic:
    return create_patient(patient=patient, session=session)


