"""Pytest configuration and shared fixtures."""

import os

os.environ.setdefault(
    "DATABASE_URL",
    "postgresql://taskflow:taskflow@localhost:5432/taskflow",
)
