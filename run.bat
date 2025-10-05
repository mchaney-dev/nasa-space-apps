@echo off
cd frontend
npm run build

cd ..
python -m demo.py
uvicorn backend.main:app --reload

pause