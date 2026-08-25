from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from ..database import get_db
from ..models import User, BuyerRequest, CropListing
from ..schemas import MatchResponse
from ..auth import require_buyer

router = APIRouter(prefix="/api/matches", tags=["Matching"])

@router.get("/{request_id}", response_model=List[MatchResponse])
def get_matches(request_id: int, db: Session = Depends(get_db), current_buyer: User = Depends(require_buyer)):
    # Verify request belongs to buyer
    buyer_request = db.query(BuyerRequest).filter(
        BuyerRequest.id == request_id, 
        BuyerRequest.buyer_id == current_buyer.id
    ).first()
    
    if not buyer_request:
        raise HTTPException(status_code=404, detail="Request not found or not owned by you")
    
    # Simple case-insensitive match on crop name
    matches = db.query(CropListing).filter(
        CropListing.is_active == True,
        func.lower(CropListing.crop_name) == func.lower(buyer_request.crop_name)
    ).all()
    
    response_matches = []
    for match in matches:
        # Check location match
        req_loc = buyer_request.location.lower()
        match_loc = match.location.lower()
        
        reason = "Matched by crop name."
        if req_loc == match_loc:
            reason = "Exact match on crop and location."
            # We can prepend it so exact matches show first, but for MVP just append
            
        match_info = MatchResponse(
            farmer_name=match.farmer.name if match.farmer else "Unknown",
            crop=match.crop_name,
            location=match.location,
            description=match.description,
            match_reason=reason
        )
        
        # simple sort logic: put exact location matches first
        if req_loc == match_loc:
            response_matches.insert(0, match_info)
        else:
            response_matches.append(match_info)
            
    return response_matches

from ..schemas import BuyerMatchResponse
from ..auth import require_farmer
from typing import Optional

@router.get("", response_model=List[BuyerMatchResponse])
def get_buyer_matches(crop: str, location: str, db: Session = Depends(get_db), current_farmer: User = Depends(require_farmer)):
    # 1. Find buyers where interested_crop matches crop (case-insensitive)
    buyers = db.query(User).filter(
        User.role == "buyer",
        func.lower(User.interested_crop) == func.lower(crop)
    ).all()
    
    matches = []
    farmer_loc_lower = location.lower()
    
    for buyer in buyers:
        buyer_loc_lower = buyer.location.lower() if buyer.location else ""
        
        score = 70
        reason = "Crop match"
        if buyer_loc_lower == farmer_loc_lower:
            score = 100
            reason = "Crop and location match"
            
        matches.append(BuyerMatchResponse(
            buyer_id=buyer.id,
            name=buyer.name,
            location=buyer.location,
            phone=buyer.phone,
            email=buyer.email,
            match_score=score,
            match_reason=reason
        ))
        
    # Sort matches by score descending
    matches.sort(key=lambda x: x.match_score, reverse=True)
    
    return matches
