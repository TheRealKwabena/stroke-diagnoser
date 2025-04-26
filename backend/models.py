from typing import Optional, List, Type
from enum import Enum
from uuid import UUID, uuid4
from typing import Annotated
from pydantic import BaseModel
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

class UserInDB(User):
    pass