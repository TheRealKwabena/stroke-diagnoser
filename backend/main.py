
"""
from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
from models import patient




@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/patients/{patient_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}




@app.post("/patients/")
def create_patient(patient: patient.Patient):
    
    create patient and add to database
    
    
    return patient
"""

from fastapi import FastAPI, APIRouter


from fastapi.middleware.cors import CORSMiddleware

from api.routes import patients

from database import create_db_and_tables
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

origins = [
   
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





@app.on_event("startup")
def on_startup():
    create_db_and_tables()

api_router = APIRouter()



api_router.include_router(patients.router)