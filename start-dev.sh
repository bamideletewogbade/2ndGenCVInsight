#!/bin/bash
# Start both backend and frontend for development
# Run from the project root: bash start-dev.sh

set -e

echo "=== Starting CV Insight AI ==="

# Start backend
echo "[1/2] Starting FastAPI backend on :8000 ..."
(cd backend && source venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000 --reload) &
BACKEND_PID=$!

# Start frontend
echo "[2/2] Starting Vite dev server on :5173 ..."
npx vite --host 0.0.0.0 &
FRONTEND_PID=$!

echo ""
echo "Backend  → http://localhost:8000/api/health"
echo "Frontend → http://localhost:5173"
echo "API Docs → http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT INT TERM

wait