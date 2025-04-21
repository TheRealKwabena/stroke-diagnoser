from fastapi import APIRouter

router = APIRouter("/patients", tags=["patients"])

# Code above omitted 👆
from models.models import Patient, PatientCreate, PatientPublic, PatientsPublic
from database import SessionDep
from fastapi import Depends, HTTPException  



# Code below omitted 👇