import httpx
import diskcache
import asyncio
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pathlib import Path
from datetime import timedelta
from typing import Optional, cast
from backend.core.loader import loader
from backend.core.utils import logging

router = APIRouter(prefix="/tiles", tags=["Tiles"])

# set up persistent cache
CACHE_DIR = Path("./cache")
CACHE_DIR.mkdir(parents=True, exist_ok=True)
# cache size limit - 1GB
cache = diskcache.Cache(CACHE_DIR, size_limit=int(1e9))
# time-to-live for cache entries - 7 days
TTL = timedelta(days=7).total_seconds()

# helper function to fetch tile with caching
async def fetch_tile_from_source(url: str) -> Optional[bytes]:
    """Fetch tile bytes from the remote source with persistent caching and async disk writes."""
    # try cache first
    if url in cache:
        return cast(bytes, cache[url])

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                content = resp.content

                # write to disk in background thread
                asyncio.create_task(asyncio.to_thread(cache.set, url, content, expire=TTL))

                return content
    except httpx.RequestError as e:
        logging.warning(f"Failed to fetch tile {url}: {e}")

    return None

@router.get("/{dataset_id}/{z}/{x}/{y}.png")
async def get_tile(dataset_id: str, z: int, x: int, y: int):
    """
    Retrieve a map tile from a compatible data source.
    Tiles are cached locally for faster repeat access.
    """
    dataset = loader.get(dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    if not dataset.source:
        raise HTTPException(status_code=400, detail="Dataset has no tile source")

    tile_url = dataset.source.format(z=z, x=x, y=y)

    # either get from cache or fetch from source
    tile_bytes = await fetch_tile_from_source(tile_url)
    if tile_bytes is None:
        raise HTTPException(status_code=404, detail="Tile not found")

    # return as streaming response - cache for 1 day in browser
    return StreamingResponse(
        iter([tile_bytes]),
        media_type="image/png",
        headers={"Cache-Control": "max-age=86400"}
    )