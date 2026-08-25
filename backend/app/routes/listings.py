from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, CropListing
from ..schemas import CropListingCreate, CropListingResponse
from ..auth import require_farmer

router = APIRouter(prefix="/api/listings", tags=["Listings"])

@router.post("", response_model=CropListingResponse)
def create_listing(listing_data: CropListingCreate, db: Session = Depends(get_db), current_farmer: User = Depends(require_farmer)):
    new_listing = CropListing(
        farmer_id=current_farmer.id,
        crop_name=listing_data.crop_name,
        location=listing_data.location,
        description=listing_data.description
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    
    response_data = CropListingResponse.model_validate(new_listing)
    response_data.farmer_name = current_farmer.name
    return response_data

@router.get("", response_model=List[CropListingResponse])
def get_all_active_listings(db: Session = Depends(get_db)):
    listings = db.query(CropListing).filter(CropListing.is_active == True).all()
    results = []
    for lst in listings:
        res = CropListingResponse.model_validate(lst)
        res.farmer_name = lst.farmer.name if lst.farmer else "Unknown"
        results.append(res)
    return results

@router.get("/my", response_model=List[CropListingResponse])
def get_my_listings(db: Session = Depends(get_db), current_farmer: User = Depends(require_farmer)):
    listings = db.query(CropListing).filter(CropListing.farmer_id == current_farmer.id).all()
    results = []
    for lst in listings:
        res = CropListingResponse.model_validate(lst)
        res.farmer_name = current_farmer.name
        results.append(res)
    return results

@router.get("/{listing_id}", response_model=CropListingResponse)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(CropListing).filter(CropListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    res = CropListingResponse.model_validate(listing)
    res.farmer_name = listing.farmer.name if listing.farmer else "Unknown"
    return res
