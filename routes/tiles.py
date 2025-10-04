from fastapi import APIRouter

router = APIRouter(prefix="/tiles", tags=["Tiles"])

# placeholder for tile retrieval
@router.get("/{dataset_id}/{z}/{x}/{y}")
def get_tile(dataset_id: str, z: int, x: int, y: int):
    return {"dataset": dataset_id, "z": z, "x": x, "y": y}