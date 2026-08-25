from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, SupportQuery
from ..schemas import SupportQueryCreate, SupportQueryResponse
from ..auth import require_farmer

router = APIRouter(prefix="/api/support", tags=["Support"])

@router.post("", response_model=SupportQueryResponse)
def create_support_query(query_data: SupportQueryCreate, db: Session = Depends(get_db), current_farmer: User = Depends(require_farmer)):
    new_query = SupportQuery(
        farmer_id=current_farmer.id,
        question=query_data.question,
        status="open"
    )
    db.add(new_query)
    db.commit()
    db.refresh(new_query)
    return new_query

@router.get("/my", response_model=List[SupportQueryResponse])
def get_my_support_queries(db: Session = Depends(get_db), current_farmer: User = Depends(require_farmer)):
    queries = db.query(SupportQuery).filter(SupportQuery.farmer_id == current_farmer.id).all()
    return queries
