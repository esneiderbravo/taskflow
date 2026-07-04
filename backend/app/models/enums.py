"""Domain enumerations."""

from enum import Enum


class TaskStatus(str, Enum):
    """Allowed workflow states for a task."""

    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"
