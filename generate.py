import os

files = {
    "backend/requirements.txt": """fastapi
uvicorn
sqlalchemy
pydantic
pydantic-settings
psycopg2
passlib[bcrypt]
python-jose[cryptography]
python-dotenv
python-multipart
""",
    "backend/.env.example": """DATABASE_URL=postgresql://user:password@localhost/dbname
JWT_SECRET_KEY=mysecretkey
""",
    "backend/README.md": """# Farm to Market Backend
Hackathon MVP Backend
""",
    "backend/app/__init__.py": "",
    "backend/app/routes/__init__.py": "",
    "backend/app/database.py": """import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite compatibility for testing if needed
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
""",
    "backend/app/models.py": """from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, index=True, nullable=True)
    password_hash = Column(String, nullable=True)
    role = Column(String, index=True)
    location = Column(String, nullable=True)
    interested_crop = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    farmer_id = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ValidFarmerID(Base):
    __tablename__ = "valid_farmer_ids"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(String, unique=True, index=True)
""",
    "backend/app/schemas.py": """from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class FarmerRegister(BaseModel):
    name: str
    phone: str
    farmer_id: str

class FarmerLogin(BaseModel):
    phone: str
    farmer_id: str

class BuyerRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: str
    phone: str
    location: str
    interested_crop: str

class BuyerLogin(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str
    location: Optional[str] = None
    interested_crop: Optional[str] = None

    class Config:
        orm_mode = True
""",
    "backend/app/auth.py": """import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .database import get_db
from .models import User
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login") # Using generic login for docs

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        role: str = payload.get("role")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

def require_farmer(current_user: User = Depends(get_current_user)):
    if current_user.role != "farmer":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

def require_buyer(current_user: User = Depends(get_current_user)):
    if current_user.role != "buyer":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user
""",
    "backend/app/routes/auth.py": """from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Farmer, ValidFarmerID
from ..schemas import FarmerRegister, FarmerLogin, BuyerRegister, BuyerLogin, AdminLogin, Token, UserResponse
from ..auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/farmer/register", response_model=Token)
def register_farmer(farmer_data: FarmerRegister, db: Session = Depends(get_db)):
    # 1. Check valid farmer id
    valid_id = db.query(ValidFarmerID).filter(ValidFarmerID.farmer_id == farmer_data.farmer_id).first()
    if not valid_id:
        raise HTTPException(status_code=400, detail="Invalid farmer ID")
    
    # 3. Check not registered
    existing_farmer = db.query(Farmer).filter(Farmer.farmer_id == farmer_data.farmer_id).first()
    if existing_farmer:
        raise HTTPException(status_code=400, detail="Farmer ID already registered")
    
    # 4. Create user
    new_user = User(
        name=farmer_data.name,
        phone=farmer_data.phone,
        role="farmer"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 5. Create farmer profile
    new_farmer = Farmer(
        user_id=new_user.id,
        farmer_id=farmer_data.farmer_id
    )
    db.add(new_farmer)
    db.commit()
    
    # 6. Return JWT
    token = create_access_token(data={"user_id": new_user.id, "role": new_user.role})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/farmer/login", response_model=Token)
def login_farmer(farmer_data: FarmerLogin, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.farmer_id == farmer_data.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    user = db.query(User).filter(User.id == farmer.user_id).first()
    if not user or user.phone != farmer_data.phone:
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    token = create_access_token(data={"user_id": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/buyer/register", response_model=Token)
def register_buyer(buyer_data: BuyerRegister, db: Session = Depends(get_db)):
    if buyer_data.password != buyer_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
        
    existing_user = db.query(User).filter(User.email == buyer_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_user = User(
        name=buyer_data.name,
        email=buyer_data.email,
        phone=buyer_data.phone,
        password_hash=get_password_hash(buyer_data.password),
        role="buyer",
        location=buyer_data.location,
        interested_crop=buyer_data.interested_crop
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token(data={"user_id": new_user.id, "role": new_user.role})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(login_data: BuyerLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    token = create_access_token(data={"user_id": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
""",
    "backend/app/main.py": """from fastapi import FastAPI
from .database import engine, Base, SessionLocal
from .models import ValidFarmerID, User
from .auth import get_password_hash
from .routes import auth

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Farm to Market MVP")

app.include_router(auth.router)

@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    
    # Seed valid farmer IDs
    demo_farmers = ["FARM1001", "FARM1002", "FARM1003", "FARM1004", "FARM1005"]
    for f_id in demo_farmers:
        exists = db.query(ValidFarmerID).filter(ValidFarmerID.farmer_id == f_id).first()
        if not exists:
            db.add(ValidFarmerID(farmer_id=f_id))
            
    # Seed admin user
    admin_email = "admin@farmtomarket.com"
    admin_exists = db.query(User).filter(User.email == admin_email).first()
    if not admin_exists:
        admin = User(
            name="Admin",
            email=admin_email,
            password_hash=get_password_hash("Admin@123"),
            role="admin"
        )
        db.add(admin)
        
    db.commit()
    db.close()

@app.get("/")
def root():
    return {"message": "Welcome to Farm to Market API"}
"""
}

for path, content in files.items():
    with open(path, 'w') as f:
        f.write(content)
