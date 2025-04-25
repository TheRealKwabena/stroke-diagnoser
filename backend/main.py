import uuid
from uuid import uuid4

import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Type
from enum import Enum
from uuid import UUID
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select

class Gender(str, Enum):
    male = "Male"
    female = "Female"

class Role(str, Enum):
    patient = "Patient"
    doctor = "Doctor"
    neurologist = "Neurologist"
class UserBase(SQLModel):
    name: str
    age: Optional[int] = None
    gender: Gender
    password_hash: Optional[str] = None #replace with hashing function

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

    role: Role

class UserPublic(UserBase):
    id: str
    role: Role


class UsersPublic(UserBase):
    users: List[UserPublic]






#Creating the frontend web links(origins) that can access the backend
origins = [
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:3000",
]



#Database setup
sqlite_file_name = "stroke_diagnoser.db"
DATABASE_URL = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(DATABASE_URL, connect_args=connect_args)

#
# Code above omitted 👆

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Code above omitted 👆

def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]




def on_startup():
    create_db_and_tables()
app = FastAPI(on_startup=[create_db_and_tables])
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"], allow_credentials=True)
# Code below omitted 👇


@app.post("/users", response_model=UserPublic)
def create_user(user: UserCreate, session: SessionDep) -> UserPublic:

    try:
        db_user = User(
            name=user.name,
            age=user.age,
            gender=user.gender,
            password_hash=user.password,  # Replace with hash function later
            role=user.role,
        )
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return db_user
    except Exception as e:
        print("Error creating user:", e)
        raise HTTPException(status_code=500, detail="Something went wrong")





@app.get("/users/", response_model=List[UserPublic])
def read_user(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> List[UserPublic]:
    try:

        users = session.exec(select(User).offset(offset).limit(limit)).all()
        return users
    except Exception as e:
        print("Error getting user", e)
        raise HTTPException(status_code=500, detail="Something went wrong")


@app.get("/users/{user_id}", response_model=UserPublic)
def read_user(user_id: str, session: SessionDep) -> UserPublic:
    user = session.get( User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Hero not found")
    return user


@app.delete("/users/{user_id}")
def delete_user(user_id: str, session: SessionDep):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(user)
    session.commit()
    return {"ok": True}






if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
