from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.db import SessionLocal
from backend.models.base_feature import Feature
from backend.models.schemas import FeatureSchema

router = APIRouter(prefix="/features", tags=["Features"])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[FeatureSchema])
def get_features(name: Optional[str] = None, lat: Optional[float] = None, lon: Optional[float] = None, db: Session = Depends(get_db)):
    query = db.query(Feature)
    if name:
        query = query.filter(Feature.name.ilike(f"%{name}%"))
    if lat is not None and lon is not None:
        query = query.filter(Feature.lat == lat, Feature.lon == lon)
    return query.all()
