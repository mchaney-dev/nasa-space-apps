# 1. build frontend
cd frontend
npm run build

# 2. build backend
cd ..
# populate database with demo data
python -m demo.py

# 3. run
uvicorn backend.main:app --reload