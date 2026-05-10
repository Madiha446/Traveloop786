from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Activity
from app.schemas import ActivityOut

router = APIRouter()

@router.get("/", response_model=List[ActivityOut])
def get_activities(
    db: Session = Depends(get_db),
    city_id: Optional[int] = Query(None),
    type: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    query = db.query(Activity)
    if city_id:
        query = query.filter(Activity.city_id == city_id)
    if type:
        query = query.filter(Activity.type == type)
    if search:
        query = query.filter(Activity.name.ilike(f"%{search}%"))
    return query.all()

@router.get("/{activity_id}", response_model=ActivityOut)
def get_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404)
    return activity