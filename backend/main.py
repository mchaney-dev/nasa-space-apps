from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import datasets, labels, tiles

app = FastAPI(title="NASA Space Apps 2025", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routers
app.include_router(datasets.router)
app.include_router(labels.router)
app.include_router(tiles.router)

# root route
@app.get("/")
def root():
    return {"message": "Hello world!"}
