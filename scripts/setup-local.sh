#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required for the database. Install it from https://docs.docker.com/get-docker/"
  exit 1
fi

if ! command -v conda >/dev/null 2>&1; then
  echo "Miniconda is required. Install it from https://www.anaconda.com/download/success"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required for the frontend. Install it from https://nodejs.org/"
  exit 1
fi

if conda env list | awk '{print $1}' | grep -qx task-flow; then
  echo "Conda environment 'task-flow' already exists."
else
  conda env create -f environment.yml
fi

conda run -n task-flow pip install -e ./backend

cd frontend
npm install
cd "$ROOT"

if [ ! -f .env ]; then
  cp .env.example .env
fi

echo ""
echo "Local setup complete."
echo "Next: make dev"
