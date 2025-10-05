import requests
from sqlalchemy.orm import Session
from backend.db import Base, engine, SessionLocal
from backend.models.base_feature import Feature

# Create tables
Base.metadata.create_all(bind=engine)

def fetch_mars_features():
    """
    Example: Fetch Mars features from USGS/NASA API.
    Adjust URL & parsing depending on available dataset.
    """
    # Here we mock 2 features for demo
    return [
        {"name": "Olympus Mons", "description": "Largest volcano on Mars", "lat": 18.65, "lon": 226.2},
        {"name": "Valles Marineris", "description": "Largest canyon on Mars", "lat": -14.6, "lon": 309.2}
    ]

def populate_db():
    db: Session = SessionLocal()
    features = fetch_mars_features()
    for f in features:
        feature = Feature(
            name=f["name"],
            description=f["description"],
            lat=f["lat"],
            lon=f["lon"],
        )
        db.add(feature)
    db.commit()
    db.close()
    print(f"Inserted {len(features)} features")

if __name__ == "__main__":
    populate_db()