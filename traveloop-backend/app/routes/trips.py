from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Trip, Stop, StopActivity
from app.schemas import TripCreate, TripUpdate, TripOut, StopCreate, StopOut, StopActivityCreate, StopActivityOut
from app.auth_deps import get_current_user
import random
import string

router = APIRouter()

def generate_share_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

@router.post("/", response_model=TripOut)
def create_trip(trip: TripCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_trip = Trip(
        user_id=current_user.id,
        name=trip.name,
        description=trip.description,
        start_date=trip.start_date,
        end_date=trip.end_date,
        cover_photo=trip.cover_photo,
        budget=trip.budget
    )
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip

@router.get("/", response_model=List[TripOut])
def get_user_trips(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trips = db.query(Trip).filter(Trip.user_id == current_user.id).all()
    # Eager load relationships to avoid N+1
    for t in trips:
        db.refresh(t)
    return trips

@router.get("/{trip_id}", response_model=TripOut)
def get_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.put("/{trip_id}", response_model=TripOut)
def update_trip(trip_id: int, trip_update: TripUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404)
    for key, value in trip_update.model_dump(exclude_unset=True).items():
        setattr(trip, key, value)
    db.commit()
    db.refresh(trip)
    return trip

@router.delete("/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404)
    db.delete(trip)
    db.commit()
    return {"ok": True}

# Stops
@router.post("/{trip_id}/stops", response_model=StopOut)
def add_stop(trip_id: int, stop: StopCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404)
    new_stop = Stop(
        trip_id=trip_id,
        city_id=stop.city_id,
        start_date=stop.start_date,
        end_date=stop.end_date,
        order_index=stop.order_index if stop.order_index is not None else len(trip.stops),
        transport_cost=stop.transport_cost,
        stay_cost=stop.stay_cost,
        meals_cost=stop.meals_cost
    )
    db.add(new_stop)
    db.commit()
    db.refresh(new_stop)
    return new_stop

@router.put("/stops/{stop_id}", response_model=StopOut)
def update_stop(stop_id: int, stop_update: StopCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stop = db.query(Stop).join(Trip).filter(Stop.id == stop_id, Trip.user_id == current_user.id).first()
    if not stop:
        raise HTTPException(status_code=404)
    for key, value in stop_update.model_dump(exclude_unset=True).items():
        setattr(stop, key, value)
    db.commit()
    db.refresh(stop)
    return stop

@router.delete("/stops/{stop_id}")
def delete_stop(stop_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stop = db.query(Stop).join(Trip).filter(Stop.id == stop_id, Trip.user_id == current_user.id).first()
    if not stop:
        raise HTTPException(status_code=404)
    db.delete(stop)
    db.commit()
    return {"ok": True}

# Stop activities
@router.post("/stops/{stop_id}/activities", response_model=StopActivityOut)
def add_activity_to_stop(stop_id: int, act: StopActivityCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stop = db.query(Stop).join(Trip).filter(Stop.id == stop_id, Trip.user_id == current_user.id).first()
    if not stop:
        raise HTTPException(status_code=404)
    sa = StopActivity(
        stop_id=stop_id,
        activity_id=act.activity_id,
        date=act.date,
        time=act.time
    )
    db.add(sa)
    db.commit()
    db.refresh(sa)
    return sa

@router.delete("/stop-activities/{sa_id}")
def remove_activity_from_stop(sa_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sa = db.query(StopActivity).join(Stop).join(Trip).filter(StopActivity.id == sa_id, Trip.user_id == current_user.id).first()
    if not sa:
        raise HTTPException(status_code=404)
    db.delete(sa)
    db.commit()
    return {"ok": True}