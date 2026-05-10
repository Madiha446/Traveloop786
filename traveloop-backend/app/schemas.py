from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    photo: Optional[str] = ""
    language: Optional[str] = "en"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Trip schemas
class StopBase(BaseModel):
    city_id: int
    start_date: date
    end_date: date
    order_index: Optional[int] = 0
    transport_cost: float = 0
    stay_cost: float = 0
    meals_cost: float = 0

class StopCreate(StopBase):
    pass

class StopOut(StopBase):
    id: int
    trip_id: int

    class Config:
        from_attributes = True

class TripBase(BaseModel):
    name: str
    description: Optional[str] = ""
    start_date: date
    end_date: date
    cover_photo: Optional[str] = ""
    budget: float = 0

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    cover_photo: Optional[str] = None
    is_public: Optional[bool] = None
    budget: Optional[float] = None

class TripOut(TripBase):
    id: int
    user_id: int
    is_public: bool
    share_code: Optional[str]
    stops: List[StopOut] = []
    packing_items: List['PackingItemOut'] = []
    notes: List['TripNoteOut'] = []

    class Config:
        from_attributes = True

# City schemas
class CityBase(BaseModel):
    name: str
    country: str
    region: str
    cost_index: float
    popularity: int
    image: str
    description: str

class CityOut(CityBase):
    id: int

    class Config:
        from_attributes = True

# Activity schemas
class ActivityBase(BaseModel):
    city_id: int
    name: str
    type: str
    cost: float
    duration: float
    image: str
    description: str

class ActivityOut(ActivityBase):
    id: int

    class Config:
        from_attributes = True

# StopActivity schemas
class StopActivityCreate(BaseModel):
    activity_id: int
    date: date
    time: Optional[str] = "10:00"

class StopActivityOut(BaseModel):
    id: int
    stop_id: int
    activity_id: int
    date: date
    time: str
    activity: Optional[ActivityOut] = None

    class Config:
        from_attributes = True

# Packing schemas
class PackingItemBase(BaseModel):
    name: str
    category: str
    is_packed: bool = False

class PackingItemCreate(PackingItemBase):
    pass

class PackingItemOut(PackingItemBase):
    id: int
    trip_id: int

    class Config:
        from_attributes = True

# Note schemas
class TripNoteBase(BaseModel):
    stop_id: Optional[int] = None
    content: str

class TripNoteCreate(TripNoteBase):
    pass

class TripNoteOut(TripNoteBase):
    id: int
    trip_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Shared itinerary
class SharedTripOut(TripOut):
    pass

# Update forward references
TripOut.model_rebuild()