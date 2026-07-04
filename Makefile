.PHONY: up down build test logs reset migrate migrate-create
.PHONY: dev dev-setup dev-db dev-migrate dev-migrate-create dev-backend dev-frontend dev-test dev-reset

CONDA_ENV ?= task-flow
MSG ?=

# --- Docker ---

up:
	docker compose up --build -d

down:
	docker compose down

build:
	docker compose build

test:
	docker compose exec backend pytest -v
	docker compose exec frontend npm test -- --run

logs:
	docker compose logs -f

migrate:
	docker compose exec backend alembic upgrade head

migrate-create:
	@test -n "$(MSG)" || (echo 'Usage: make migrate-create MSG="describe your change"' && exit 1)
	docker compose run --rm \
		-v "$(CURDIR)/backend/app:/app/app" \
		-v "$(CURDIR)/backend/alembic:/app/alembic" \
		backend alembic revision --autogenerate -m "$(MSG)"

reset:
	docker compose down -v
	docker compose up --build -d

# --- Local (Miniconda + Node.js, PostgreSQL in Docker) ---

dev:
	bash scripts/dev-local.sh

dev-setup:
	bash scripts/setup-local.sh

dev-db:
	docker compose up db -d

dev-migrate:
	cd backend && conda run -n $(CONDA_ENV) alembic upgrade head

dev-migrate-create:
	@test -n "$(MSG)" || (echo 'Usage: make dev-migrate-create MSG="describe your change"' && exit 1)
	cd backend && conda run -n $(CONDA_ENV) alembic revision --autogenerate -m "$(MSG)"

dev-backend:
	cd backend && conda run -n $(CONDA_ENV) uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && npm run dev

dev-test:
	cd backend && conda run -n $(CONDA_ENV) pytest -v
	cd frontend && npm test -- --run

dev-reset:
	docker compose down -v
	docker compose up db -d
	$(MAKE) dev-migrate
