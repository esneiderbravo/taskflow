.PHONY: up down build test logs reset migrate

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

reset:
	docker compose down -v
	docker compose up --build -d
