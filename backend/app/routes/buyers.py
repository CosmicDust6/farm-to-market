from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import BuyerUpdateRequest, UserResponse
from ..auth import require_buyer

router = APIRouter(prefix="/api/buyers", tags=["Buyers"])

@router.put("/me", response_model=UserResponse)
def update_buyer_profile(update_data: BuyerUpdateRequest, db: Session = Depends(get_db), current_buyer: User = Depends(require_buyer)):
    current_buyer.location = update_data.location
    current_buyer.interested_crop = update_data.interested_crop
    
    db.commit()
    db.refresh(current_buyer)
    
    return current_buyer
