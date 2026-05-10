from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, Date, Index
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    photo = Column(String(500), default="")
    language = Column(String(10), default="en")
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    trips = relationship("Trip", back_populates="owner", cascade="all, delete-orphan")

class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, default="")
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    cover_photo = Column(String(500), default="")
    is_public = Column(Boolean, default=False)
    share_code = Column(String(20), unique=True, index=True, nullable=True)
    budget = Column(Float, default=0)

    owner = relationship("User", back_populates="trips")
    stops = relationship("Stop", back_populates="trip", cascade="all, delete-orphan")
    packing_items = relationship("PackingItem", back_populates="trip", cascade="all, delete-orphan")
    notes = relationship("TripNote", back_populates="trip", cascade="all, delete-orphan")

class Stop(Base):
    __tablename__ = "stops"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    order_index = Column(Integer, nullable=False)
    transport_cost = Column(Float, default=0)
    stay_cost = Column(Float, default=0)
    meals_cost = Column(Float, default=0)

    trip = relationship("Trip", back_populates="stops")
    city = relationship("City")
    activities = relationship("StopActivity", back_populates="stop", cascade="all, delete-orphan")

class City(Base):
    __tablename__ = "cities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    country = Column(String(100), default="India")
    region = Column(String(100))
    cost_index = Column(Float, default=2.0)
    popularity = Column(Integer, default=80)
    image = Column(String(500))
    description = Column(Text)

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    name = Column(String(200), nullable=False)
    type = Column(String(50))
    cost = Column(Float, default=0)
    duration = Column(Float)  # hours
    image = Column(String(500))
    description = Column(Text)

    city = relationship("City")

class StopActivity(Base):
    __tablename__ = "stop_activities"
    id = Column(Integer, primary_key=True, index=True)
    stop_id = Column(Integer, ForeignKey("stops.id"), nullable=False)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=False)
    date = Column(Date, nullable=False)
    time = Column(String(10), default="10:00")

    stop = relationship("Stop", back_populates="activities")
    activity = relationship("Activity")

class PackingItem(Base):
    __tablename__ = "packing_items"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    name = Column(String(200), nullable=False)
    category = Column(String(50))
    is_packed = Column(Boolean, default=False)

    trip = relationship("Trip", back_populates="packing_items")

class TripNote(Base):
    __tablename__ = "trip_notes"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    stop_id = Column(Integer, ForeignKey("stops.id"), nullable=True)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    trip = relationship("Trip", back_populates="notes")
    stop = relationship("Stop")