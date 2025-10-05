from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from backend.routes import datasets, features, tiles
from backend.core.config import FRONTEND_DIR

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
app.include_router(features.router)
app.include_router(tiles.router)

# root route
@app.get("/")
async def root():
    return RedirectResponse("/index.html")

app.mount("/", StaticFiles(directory=f"{FRONTEND_DIR}/dist", html=True), name="frontend")