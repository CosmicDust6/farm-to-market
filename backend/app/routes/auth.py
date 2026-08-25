from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Farmer, ValidFarmerID
from ..schemas import FarmerRegister, FarmerLogin, BuyerRegister, LoginRequest, AdminLogin, Token, UserResponse
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
    return {"access_token": token, "token_type": "bearer", "role": new_user.role}

@router.post("/farmer/login", response_model=Token)
def login_farmer(farmer_data: FarmerLogin, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.farmer_id == farmer_data.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    user = db.query(User).filter(User.id == farmer.user_id).first()
    if not user or user.phone != farmer_data.phone:
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    token = create_access_token(data={"user_id": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role}

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
    return {"access_token": token, "token_type": "bearer", "role": new_user.role}

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    token = create_access_token(data={"user_id": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role}

from fastapi.security import OAuth2PasswordRequestForm

@router.post("/swagger-login", include_in_schema=False)
def swagger_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    token = create_access_token(data={"user_id": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
