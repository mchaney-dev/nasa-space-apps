@echo off
cd frontend
npm install
npm run build

cd ..
poetry install
uvicorn backend.main:app --reload

pause