from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, trips, cities, activities, packing, notes, shared, admin

# Create tables (if not exists)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Traveloop API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(trips.router, prefix="/api/trips", tags=["trips"])
app.include_router(cities.router, prefix="/api/cities", tags=["cities"])
app.include_router(activities.router, prefix="/api/activities", tags=["activities"])
app.include_router(packing.router, prefix="/api/packing", tags=["packing"])
app.include_router(notes.router, prefix="/api/notes", tags=["notes"])
app.include_router(shared.router, prefix="/api/shared", tags=["shared"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

@app.get("/")
def root():
    return {"message": "Traveloop API is running. Visit /docs for Swagger documentation."}