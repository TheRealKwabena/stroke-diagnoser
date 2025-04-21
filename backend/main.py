from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
from models import patient
from database import create_db_and_tables
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()



@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/patients/{patient_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}




@app.post("/patients/")
def create_patient(patient: patient.Patient):
    """
    create patient and add to database
    
    """
    return patient
