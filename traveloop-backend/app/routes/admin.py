from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Trip, City, Activity
from app.schemas import UserOut, TripOut
from app.auth_deps import get_current_admin

router = APIRouter()

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    total_users = db.query(User).count()
    total_trips = db.query(Trip).count()
    total_stops = sum(len(t.stops) for t in db.query(Trip).all())
    total_activities = sum(sum(len(s.activities) for s in t.stops) for t in db.query(Trip).all())
    return {
        "total_users": total_users,
        "total_trips": total_trips,
        "total_stops": total_stops,
        "total_activities": total_activities
    }

@router.get("/users", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return db.query(User).all()

@router.get("/trips", response_model=List[TripOut])
def list_all_trips(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    return db.query(Trip).all()

@router.get("/top-cities")
def top_cities(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    from sqlalchemy import func
    city_counts = db.query(City.name, func.count(Stop.id)).join(Stop).group_by(City.id).order_by(func.count(Stop.id).desc()).limit(5).all()
    return [{"city": c, "count": cnt} for c, cnt in city_counts]