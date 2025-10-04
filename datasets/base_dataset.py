from typing import Optional

"""
Base class for datasets.
"""
class BaseDataset:
    def __init__(self, id: str, name: str, type: str, source: str, description: Optional[str] = None):
        self.id = id
        self.name = name
        self.type = type
        self.source = source
        self.description = description

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "source": self.source,
            "description": self.description
        }