from sqlalchemy import Column, Integer, String, Float
from backend.db import Base

class Feature(Base):
    __tablename__ = "features"

    feature_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    lat = Column(Float)
    lon = Column(Float)