from typing import Dict
from core.config import get_manifest
from datasets.base_dataset import BaseDataset

"""
Dynamically loads datasets from manifest.json and provides access by ID.
"""
class DatasetLoader:
    def __init__(self):
        self._datasets: Dict[str, BaseDataset] = {}
        self._load_from_manifest()

    def _load_from_manifest(self):
        manifest = get_manifest()
        for item in manifest.get("datasets", []):
            dataset = BaseDataset(**item)
            self._datasets[dataset.dataset_id] = dataset

    def get_all(self):
        return list(self._datasets.values())

    def get(self, dataset_id: str) -> BaseDataset | None:
        return self._datasets.get(dataset_id)

# singleton instance
loader = DatasetLoader()
