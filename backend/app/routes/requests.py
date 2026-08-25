from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, BuyerRequest
from ..schemas import BuyerRequestCreate, BuyerRequestResponse
from ..auth import require_buyer

router = APIRouter(prefix="/api/requests", tags=["Buyer Requests"])

@router.post("", response_model=BuyerRequestResponse)
def create_request(request_data: BuyerRequestCreate, db: Session = Depends(get_db), current_buyer: User = Depends(require_buyer)):
    new_request = BuyerRequest(
        buyer_id=current_buyer.id,
        crop_name=request_data.crop_name,
        location=request_data.location
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@router.get("/my", response_model=List[BuyerRequestResponse])
def get_my_requests(db: Session = Depends(get_db), current_buyer: User = Depends(require_buyer)):
    requests = db.query(BuyerRequest).filter(BuyerRequest.buyer_id == current_buyer.id).all()
    return requests
