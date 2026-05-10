from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import City
from app.schemas import CityOut

router = APIRouter()

@router.get("/", response_model=List[CityOut])
def get_cities(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    sort_by: Optional[str] = Query(None, regex="^(name|popularity|cost_index)$")
):
    query = db.query(City)
    if search:
        query = query.filter(City.name.ilike(f"%{search}%") | City.region.ilike(f"%{search}%"))
    if region:
        query = query.filter(City.region == region)
    if sort_by == "popularity":
        query = query.order_by(City.popularity.desc())
    elif sort_by == "cost_index":
        query = query.order_by(City.cost_index)
    else:
        query = query.order_by(City.name)
    return query.all()

@router.get("/{city_id}", response_model=CityOut)
def get_city(city_id: int, db: Session = Depends(get_db)):
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404)
    return city