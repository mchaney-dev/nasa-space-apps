from fastapi import APIRouter, HTTPException
from core.loader import loader

router = APIRouter(prefix="/datasets", tags=["Datasets"])

@router.get("/")
def get_datasets():
    """Return all available datasets."""
    return [ds.to_dict() for ds in loader.get_all()]

@router.get("/{dataset_id}")
def get_dataset(dataset_id: str):
    """Return metadata for a specific dataset."""
    dataset = loader.get(dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset.to_dict()
