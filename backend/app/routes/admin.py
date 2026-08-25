from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, Farmer
from ..schemas import AdminUserResponse
from ..auth import require_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/farmers", response_model=List[AdminUserResponse])
def get_all_farmers(db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    farmers = db.query(User).filter(User.role == "farmer").all()
    return farmers

@router.get("/buyers", response_model=List[AdminUserResponse])
def get_all_buyers(db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    buyers = db.query(User).filter(User.role == "buyer").all()
    return buyers

from ..models import SupportQuery
from ..schemas import AdminStatsResponse, AdminSupportQueryResponse, SupportQueryUpdate
from fastapi import HTTPException

@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    total_farmers = db.query(User).filter(User.role == "farmer").count()
    total_buyers = db.query(User).filter(User.role == "buyer").count()
    total_queries = db.query(SupportQuery).count()
    
    return {
        "total_farmers": total_farmers,
        "total_buyers": total_buyers,
        "total_support_queries": total_queries
    }

@router.get("/support", response_model=List[AdminSupportQueryResponse])
def get_all_support_queries(db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    queries = db.query(SupportQuery).all()
    response = []
    for q in queries:
        response.append(AdminSupportQueryResponse(
            id=q.id,
            farmer_id=q.farmer_id,
            farmer_name=q.farmer.name if q.farmer else "Unknown",
            question=q.question,
            status=q.status,
            created_at=q.created_at
        ))
    return response

@router.patch("/support/{query_id}", response_model=AdminSupportQueryResponse)
def resolve_support_query(query_id: int, update_data: SupportQueryUpdate, db: Session = Depends(get_db), current_admin: User = Depends(require_admin)):
    if update_data.status not in ["open", "resolved"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be 'open' or 'resolved'")
        
    query = db.query(SupportQuery).filter(SupportQuery.id == query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Support query not found")
        
    query.status = update_data.status
    db.commit()
    db.refresh(query)
    
    return AdminSupportQueryResponse(
        id=query.id,
        farmer_id=query.farmer_id,
        farmer_name=query.farmer.name if query.farmer else "Unknown",
        question=query.question,
        status=query.status,
        created_at=query.created_at
    )
