from fastapi import FastAPI
from backend.routes import datasets, labels, tiles

app = FastAPI(title="NASA Space Apps 2025", version="0.1.0")

# routers
app.include_router(datasets.router)
app.include_router(labels.router)
app.include_router(tiles.router)

# root route
@app.get("/")
def root():
    return {"message": "Hello world!"}
