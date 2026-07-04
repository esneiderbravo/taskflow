.PHONY: up down build test logs seed reset

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

seed:
	docker compose exec backend python scripts/seed.py

reset:
	docker compose down -v
	rm -rf data/
	docker compose up --build -d
