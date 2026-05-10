from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Trip, PackingItem
from app.schemas import PackingItemCreate, PackingItemOut
from app.auth_deps import get_current_user

router = APIRouter()

@router.get("/{trip_id}", response_model=List[PackingItemOut])
def get_packing_items(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404)
    return trip.packing_items

@router.post("/{trip_id}", response_model=PackingItemOut)
def add_packing_item(trip_id: int, item: PackingItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404)
    new_item = PackingItem(
        trip_id=trip_id,
        name=item.name,
        category=item.category,
        is_packed=item.is_packed
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{item_id}", response_model=PackingItemOut)
def update_packing_item(item_id: int, item_update: PackingItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(PackingItem).join(Trip).filter(PackingItem.id == item_id, Trip.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404)
    item.name = item_update.name
    item.category = item_update.category
    item.is_packed = item_update.is_packed
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_packing_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(PackingItem).join(Trip).filter(PackingItem.id == item_id, Trip.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404)
    db.delete(item)
    db.commit()
    return {"ok": True}