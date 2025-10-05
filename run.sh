# 1. build frontend
cd frontend
npm install
npm run build

# 2. build backend
cd ..
poetry install
uvicorn backend.main:app --reload