from pathlib import Path
import json

ROOT_DIR = Path(__file__).resolve().parent.parent
DATASETS_DIR = ROOT_DIR / "datasets"
MANIFEST = DATASETS_DIR / "manifest.json"
FRONTEND_DIR = ROOT_DIR.parent / "frontend"

def get_manifest():
    with open(MANIFEST, "r") as f:
        return json.load(f)