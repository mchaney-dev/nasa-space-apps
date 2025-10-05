from pydantic import BaseModel

class FeatureSchema(BaseModel):
    feature_id: int
    name: str
    description: str
    lat: float
    lon: float

    class Config:
        orm_mode = True