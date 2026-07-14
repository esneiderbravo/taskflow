.PHONY: up down build test logs reset migrate migrate-create help

MSG ?=

help:
	@echo "TaskFlow — full Docker only (workshop)"
	@echo ""
	@echo "  make up                 Start/rebuild stack (db + backend + frontend)"
	@echo "  make down               Stop containers"
	@echo "  make reset              Wipe DB volumes and rebuild stack"
	@echo "  make logs               Follow container logs"
	@echo "  make migrate            Apply Alembic migrations"
	@echo "  make migrate-create MSG=\"...\"   Autogenerate a migration"
	@echo "  make test               Run backend + frontend tests in containers"
	@echo ""
	@echo "After code changes:  make up && make logs"
	@echo "After branch switch: make down && git checkout <branch> && make reset"

# --- Full Docker stack ---

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
