from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ml.crop_service import recommend_crop
from ml.price_service import predict_price

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])

class CropPredictionRequest(BaseModel):
    soil_type: str
    land_area: float
    location: str
    budget: float
    water_availability: str

class PricePredictionRequest(BaseModel):
    crop: str
    location: str

@router.post("/crop-recommendation")
def predict_crop(request: CropPredictionRequest):
    try:
        return recommend_crop(
            soil_type=request.soil_type,
            land_area=request.land_area,
            location=request.location,
            budget=request.budget,
            water_availability=request.water_availability
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/price")
def predict_market_price(request: PricePredictionRequest):
    try:
        return predict_price(
            crop=request.crop,
            location=request.location
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
