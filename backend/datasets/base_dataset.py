from pydantic import BaseModel, Field

"""
Base class for datasets loaded from manifest.json.
"""
class BaseDataset(BaseModel):
    dataset_id: str = Field(alias="id")
    name: str
    dataset_type: str = Field(alias="type")
    source: str | None = None
    description: str | None = None

    def to_dict(self):
        return self.model_dump(by_alias=True)
