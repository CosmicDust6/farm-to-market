from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
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

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str
    location: Optional[str] = None
    interested_crop: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class CropListingCreate(BaseModel):
    crop_name: str
    location: str
    description: Optional[str] = None

class CropListingResponse(BaseModel):
    id: int
    farmer_id: int
    farmer_name: Optional[str] = None
    crop_name: str
    location: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BuyerRequestCreate(BaseModel):
    crop_name: str
    location: str

class BuyerRequestResponse(BaseModel):
    id: int
    buyer_id: int
    crop_name: str
    location: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MatchResponse(BaseModel):
    farmer_name: str
    crop: str
    location: str
    description: Optional[str] = None
    match_reason: str

class BuyerUpdateRequest(BaseModel):
    location: str
    interested_crop: str

class BuyerMatchResponse(BaseModel):
    buyer_id: int
    name: str
    location: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    match_score: int
    match_reason: str

    model_config = ConfigDict(from_attributes=True)

class AdminUserResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    interested_crop: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class SupportQueryCreate(BaseModel):
    question: str

class SupportQueryResponse(BaseModel):
    id: int
    farmer_id: int
    question: str
    status: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class AdminSupportQueryResponse(BaseModel):
    id: int
    farmer_id: int
    farmer_name: str
    question: str
    status: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class AdminStatsResponse(BaseModel):
    total_farmers: int
    total_buyers: int
    total_support_queries: int

class SupportQueryUpdate(BaseModel):
    status: str
