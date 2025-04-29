from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os
import jwt
from models import *
import uvicorn
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from jwt.exceptions import InvalidTokenError
from typing import Optional, List, Type
from typing import Annotated
from passlib.context import CryptContext
from fastapi import Depends, FastAPI, HTTPException, Query, status
from sqlmodel import Field, Session, SQLModel, create_engine, select
import random

load_dotenv()

#Secret key in .env files to encapsulate our private secrets and variables
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
DATABASE_URL = os.getenv("DATABASE_URL")



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#Function to compare provided passwords to the hashed password in the database
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

#Hashes password
def get_password_hash(password):
    return pwd_context.hash(password)




#Creating the frontend web links(origins) that can access the backend
origins = [
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:3000",
]



#Database setup
connect_args = {"check_same_thread": False}
engine = create_engine(DATABASE_URL, connect_args=connect_args)


#Create database and tables upon startup

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)



def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


def on_startup():
    create_db_and_tables()


app = FastAPI(on_startup=[create_db_and_tables])
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"],
                   allow_credentials=True)


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

#Generates access token during signup
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


@app.get("/users/me/", response_model=User, tags=["Users"])
async def read_users_me(
        current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user

"""
@app.get("/users/me/items/")
async def read_own_items(
        current_user: Annotated[User, Depends(get_current_active_user)],
):
    return [{"item_id": "Foo", "owner": current_user.username}]
"""

@app.post("/users", response_model=UserPublic, tags=["Users"])
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


@app.get("/users/", response_model=List[UserPublic], tags=["Users"])
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


@app.get("/users/{user_id}", response_model=UserPublic,  tags=["Users"])
def read_user(user_id: str, session: SessionDep) -> UserPublic:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Hero not found")
    return user


@app.delete("/users/{user_id}", response_model=dict, tags=["Users"])
def delete_user(user_id: str, session: SessionDep):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(user)
    session.commit()
    return {"ok": True}


@app.delete("/users/", response_model=dict,  tags=["Users"])
def delete_all_users(session: SessionDep):
    statement = select(User)
    users = session.exec(statement).all()

    if not users:
        return {"message": "No users to delete."}

    for user in users:
        session.delete(user)

    session.commit()

    return {"message": f"Deleted {len(users)} users."}


def verify_role(current_user: User, allowed_roles: list[str]):
    if current_user.role not in allowed_roles:
        raise HTTPException(status_code=403, detail="Operation not permitted for your role.")

# VITALS
@app.post("/users/me/vitals", response_model=VitalsPublic, tags=["Vitals"])
async def create_vitals_for_user(
    vitals: VitalsCreate,
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    verify_role(current_user, ["Patient"])

    simulated_nihss = random.randint(0, 10)
    simulated_inr = round(random.uniform(0.8, 3.0), 2)

    db_vitals = Vitals(
        **vitals.dict(),
        user_id=current_user.id,
        nihss_score=simulated_nihss,
        inr_score=simulated_inr
    )
    session.add(db_vitals)
    session.commit()
    session.refresh(db_vitals)
    return db_vitals

@app.get("/users/{user_id}/vitals", response_model=VitalsPublic, tags=["Vitals"])
async def get_vitals_for_user(
    user_id: str,
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    verify_role(current_user, ["Doctor", "Neurologist", "Patient"])
    vitals = session.exec(select(Vitals).where(Vitals.user_id == user_id)).first()
    if not vitals:
        raise HTTPException(status_code=404, detail="Vitals not found.")
    return vitals

#LAB RESULTS
# LAB RESULTS
@app.post("/users/me/results", response_model=LabResultPublic, tags=["Results"])
async def create_lab_result_for_user(

    lab_result: LabResultCreate,
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    verify_role(current_user, ["Patient"])

    db_lab_result = LabResult(
        **lab_result.dict(),
        user_id=current_user.id
    )
    session.add(db_lab_result)
    session.commit()
    session.refresh(db_lab_result)
    return db_lab_result

@app.get("/users/{user_id}/results", response_model=LabResultPublic,  tags=["Results"])
async def get_lab_result_for_user(
    user_id: str,
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    #verifies if user is a doctor or neurologist and allows them to perform the request
    verify_role(current_user, ["Doctor", "Neurologist"])
    #verify_role(current_user, ["Doctor", "Neurologist", "Patient"])
    lab_result = session.exec(select(LabResult).where(LabResult.user_id == user_id)).first()
    if not lab_result:
        raise HTTPException(status_code=404, detail="Lab results not found.")
    return lab_result


# NEUROLOGIST CONSULTATION
@app.post("/users/{user_id}/consultations", response_model=NeurologistConsultationPublic,  tags=["Consultations"])
async def create_consultation_for_user(
    user_id: str,
    consultation: NeurologistConsultationCreate,
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    verify_role(current_user, ["Neurologist"])

    db_consultation = NeurologistConsultation(
        **consultation.dict(),
        user_id=user_id
    )
    session.add(db_consultation)
    session.commit()
    session.refresh(db_consultation)
    return db_consultation

@app.get("/users/{user_id}/consultations", response_model=List[NeurologistConsultationPublic], tags=["Consultations"])
async def get_consultations_for_user(
    user_id: str,
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    verify_role(current_user, ["Doctor", "Neurologist"])

    consultations = session.exec(select(NeurologistConsultation).where(NeurologistConsultation.user_id == user_id)).all()
    return consultations


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000,
                reload=True,
                log_level="debug")
