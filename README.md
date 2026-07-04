# TaskFlow

A lightweight, full-stack project and task management application built for the **PyCon 2026** workshop — *Beyond Vibe Coding: Spec-Driven Development with Code Graphs*.

TaskFlow provides a practical sandbox to explore modern development workflows: manage projects and tasks through a clean web UI, interact with a REST API, and iterate on features in a containerized environment. The entire stack runs with a single command — no local runtime setup required.

**Stack:** Next.js · FastAPI · PostgreSQL · Docker

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/)

## 🚀 Getting Started

```bash
git clone https://github.com/esneiderbravo/taskflow.git
cd taskflow
make up
```

The first build takes about 90 seconds. Subsequent starts are under 30 seconds.

| Service | URL |
|---------|-----|
| 🖥️ Frontend | http://localhost:3000 |
| 📖 API docs | http://localhost:8000/docs |

Verify the backend is healthy:

```bash
curl http://localhost:8000/health
# {"status":"ok"}
```

Stop the application:

```bash
make down
```

Follow container logs:

```bash
make logs
```

## 🔄 Seeing Your Changes

The app runs entirely inside Docker. After editing any file, rebuild and restart the stack:

```bash
make up
```

Then refresh http://localhost:3000 in your browser to see the updated app.
