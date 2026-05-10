from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Trip, TripNote
from app.schemas import TripNoteCreate, TripNoteOut
from app.auth_deps import get_current_user

router = APIRouter()

@router.get("/{trip_id}", response_model=List[TripNoteOut])
def get_notes(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404)
    return trip.notes

@router.post("/{trip_id}", response_model=TripNoteOut)
def add_note(trip_id: int, note: TripNoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404)
    new_note = TripNote(
        trip_id=trip_id,
        stop_id=note.stop_id,
        content=note.content
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@router.put("/{note_id}", response_model=TripNoteOut)
def update_note(note_id: int, note_update: TripNoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(TripNote).join(Trip).filter(TripNote.id == note_id, Trip.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404)
    note.content = note_update.content
    note.stop_id = note_update.stop_id
    db.commit()
    db.refresh(note)
    return note

@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(TripNote).join(Trip).filter(TripNote.id == note_id, Trip.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404)
    db.delete(note)
    db.commit()
    return {"ok": True}