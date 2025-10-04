from fastapi import APIRouter

router = APIRouter(prefix="/labels", tags=["Labels"])

# placeholder for label-related endpoints
@router.get("/")
def get_labels():
    return {"message": "List of labels (to be implemented)"}