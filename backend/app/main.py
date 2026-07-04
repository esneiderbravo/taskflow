"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown lifecycle.

    Args:
        app: FastAPI application instance.

    Yields:
        None: Control returns while the application is running.
    """
    yield


app = FastAPI(
    title="TaskFlow API",
    description="Lightweight project and task management for the PyCon 2026 workshop",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
def health() -> dict[str, str]:
    """Return API health status.

    Returns:
        dict[str, str]: Health payload with status key set to ``ok``.
    """
    return {"status": "ok"}
