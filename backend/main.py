import uuid
from uuid import uuid4
from datetime import datetime, timedelta, timezone

import jwt

from models import *
from auth import verify_password, get_password_hash
import uvicorn
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from jwt.exceptions import InvalidTokenError
from pydantic import BaseModel
from typing import Optional, List, Type
from enum import Enum
from uuid import UUID
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query, status
from sqlmodel import Field, Session, SQLModel, create_engine, select



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


# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "c2e11c2d96be3ce73b24060b37687761f9b4c4fd87f2c781cc22ee2621d2fe3f"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


#Creating the frontend web links(origins) that can access the backend
origins = [
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:3000",
]



#Database setup
sqlite_file_name = "medstroker.db"
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


def get_user(session: SessionDep, username: str) -> Optional[User]:
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    print(user)
    return user


def authenticate_user(session: SessionDep, username: str, password: str):
    user = get_user(session, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user



def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: SessionDep
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception

    user = get_user(session, username=token_data.username)  # ✅ Correct
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):

    return current_user


@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDep
) -> Token:
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@app.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return [{"item_id": "Foo", "owner": current_user.username}]

@app.post("/users", response_model=UserPublic)
def create_user(user: UserCreate, session: SessionDep) -> UserPublic:

    try:
        hashed_password = get_password_hash(user.password)
        print(hashed_password)
        db_user = User(
            name=user.name,
            username=user.username,
            age=user.age,
            gender=user.gender,
            hashed_password=hashed_password,  # Replace with hash function later
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

@app.delete("/users/", response_model=dict)
def delete_all_users(session: SessionDep):
    statement = select(User)
    users = session.exec(statement).all()

    if not users:
        return {"message": "No users to delete."}

    for user in users:
        session.delete(user)

    session.commit()

    return {"message": f"Deleted {len(users)} users."}



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000,
        reload=True,
        log_level="debug")
