from typing import Dict, Any
from core.config import get_manifest
from datasets.base_dataset import BaseDataset

"""
Dynamically loads datasets from a manifest file and provides access to them.
"""
class DatasetLoader:
    def __init__(self):
        self._datasets: Dict[str, BaseDataset] = {}
        self._load_from_manifest()

    def _load_from_manifest(self):
        manifest = get_manifest()
        for item in manifest["datasets"]:
            dataset = BaseDataset(**item)
            self._datasets[dataset.id] = dataset

    def get_all(self):
        return list(self._datasets.values())

    def get(self, dataset_id: str) -> BaseDataset:
        return self._datasets.get(dataset_id)

# singleton instance
loader = DatasetLoader()