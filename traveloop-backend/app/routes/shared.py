from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Trip
from app.schemas import SharedTripOut

router = APIRouter()

@router.get("/{share_code}", response_model=SharedTripOut)
def get_shared_trip(share_code: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.share_code == share_code, Trip.is_public == True).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found or not shared")
    return trip

@router.post("/{trip_id}/generate-code")
def generate_share_code(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404)
    import random, string
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    trip.share_code = code
    db.commit()
    return {"share_code": code}