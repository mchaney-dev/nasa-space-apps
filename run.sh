# 1. build frontend
cd frontend
npm install
npm run build

# 2. build backend
cd ..
poetry install
# populate database with demo data
python -m demo.py

# 3. run
uvicorn backend.main:app --reload