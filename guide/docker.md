# Docker

Entire stack in containers. No Python, Node.js, or conda on your machine.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)

## Start

```bash
make up
```

First build ~90s. You should see three containers: `db`, `backend`, `frontend`.

## URLs

| Service | URL |
| ------- | --- |
| Frontend | [http://localhost:3000](http://localhost:3000) |
| API docs | [http://localhost:8000/docs](http://localhost:8000/docs) |
| Health | [http://localhost:8000/health](http://localhost:8000/health) |

## Seeing changes

Edits are **not** live. After saving code:

```bash
make up
make logs   # wait for "Application startup complete"
```

## Commands

| Command | Description |
| ------- | ----------- |
| `make up` | Build and start all services |
| `make down` | Stop all services |
| `make logs` | Follow container logs |
| `make migrate` | Apply pending migrations |
| `make migrate-create MSG="..."` | New migration file |
| `make reset` | Wipe DB volume and restart |
| `make test` | Run backend and frontend tests |

Migrations live in `backend/alembic/versions/`.
