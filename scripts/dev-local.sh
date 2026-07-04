#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

CONDA_ENV="${CONDA_ENV:-task-flow}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

cleanup() {
  echo ""
  echo "Stopping local services..."
  if [ -n "${BACKEND_PID:-}" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "${FRONTEND_PID:-}" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  wait 2>/dev/null || true
  echo "Done. Database container is still running (make dev-db / docker compose stop db to stop it)."
}

trap cleanup EXIT INT TERM

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

require_cmd docker
require_cmd conda
require_cmd node
require_cmd npm

if ! conda env list | awk '{print $1}' | grep -qx "$CONDA_ENV"; then
  echo "Conda environment '$CONDA_ENV' not found. Run: make dev-setup"
  exit 1
fi

if [ ! -d frontend/node_modules ]; then
  echo "Frontend dependencies not installed. Run: make dev-setup"
  exit 1
fi

if [ ! -f .env ]; then
  cp .env.example .env
fi

echo "Starting PostgreSQL (Docker)..."
docker compose up db -d

echo "Waiting for database..."
until docker compose exec -T db pg_isready -U taskflow -d taskflow >/dev/null 2>&1; do
  sleep 1
done

echo "Running migrations..."
cd backend
conda run -n "$CONDA_ENV" alembic upgrade head
cd "$ROOT"

echo "Starting backend on http://localhost:${BACKEND_PORT} ..."
(
  cd backend
  exec conda run -n "$CONDA_ENV" uvicorn app.main:app --reload --host 0.0.0.0 --port "$BACKEND_PORT"
) &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:${FRONTEND_PORT} ..."
(
  cd frontend
  exec npm run dev -- --port "$FRONTEND_PORT"
) &
FRONTEND_PID=$!

echo ""
echo "TaskFlow is running locally."
echo "  Frontend:  http://localhost:${FRONTEND_PORT}"
echo "  API docs:  http://localhost:${BACKEND_PORT}/docs"
echo "Press Ctrl+C to stop backend and frontend."
echo ""

wait -n "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || wait
