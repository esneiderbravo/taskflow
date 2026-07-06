"use client";

import { useCallback, useEffect, useState } from "react";
import { api, PAGE_SIZE, PaginatedProjects, Task, TaskCounts, TaskStatus } from "@/lib/api";

export function useProjects() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [data, setData] = useState<PaginatedProjects | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await api.listProjects({
        search: debouncedSearch || undefined,
        limit: PAGE_SIZE.projects,
        offset: page * PAGE_SIZE.projects,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createProject = async (name: string) => {
    const project = await api.createProject(name);
    await refresh();
    return project;
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE.projects)) : 1;

  return {
    projects: data?.items ?? [],
    total: data?.total ?? 0,
    taskTotal: data?.task_total ?? 0,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    refresh,
    createProject,
  };
}

export interface ColumnState {
  tasks: Task[];
  total: number;
  loading: boolean;
}

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "done"];

const emptyColumns = (): Record<TaskStatus, ColumnState> => ({
  todo: { tasks: [], total: 0, loading: true },
  in_progress: { tasks: [], total: 0, loading: true },
  done: { tasks: [], total: 0, loading: true },
});

export function useProjectBoard(projectId: string) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [columns, setColumns] = useState<Record<TaskStatus, ColumnState>>(emptyColumns);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadColumn = useCallback(
    async (status: TaskStatus, append = false) => {
      let offset = 0;
      setColumns((prev) => {
        offset = append ? prev[status].tasks.length : 0;
        return {
          ...prev,
          [status]: { ...prev[status], loading: true },
        };
      });

      try {
        setError(null);
        const result = await api.listTasks(projectId, {
          status,
          search: debouncedSearch || undefined,
          limit: PAGE_SIZE.tasks,
          offset,
        });

        setColumns((prev) => ({
          ...prev,
          [status]: {
            tasks: append ? [...prev[status].tasks, ...result.items] : result.items,
            total: result.total,
            loading: false,
          },
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tasks");
        setColumns((prev) => ({
          ...prev,
          [status]: { ...prev[status], loading: false },
        }));
      }
    },
    [projectId, debouncedSearch]
  );

  const refreshAll = useCallback(async () => {
    await Promise.all(STATUS_ORDER.map((status) => loadColumn(status)));
  }, [loadColumn]);

  useEffect(() => {
    setColumns(emptyColumns());
    void refreshAll();
  }, [projectId, debouncedSearch, refreshAll]);

  const createTask = async (title: string, description?: string) => {
    const task = await api.createTask(projectId, { title, description });
    await loadColumn(task.status);
    return task;
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    const updated = await api.updateTask(taskId, { status });
    await Promise.all(STATUS_ORDER.map((columnStatus) => loadColumn(columnStatus)));
    return updated;
  };

  const loadMore = (status: TaskStatus) => loadColumn(status, true);

  const allTasks = STATUS_ORDER.flatMap((status) => columns[status].tasks);
  const loading = STATUS_ORDER.every(
    (status) => columns[status].loading && columns[status].tasks.length === 0
  );

  return {
    columns,
    allTasks,
    search,
    setSearch,
    loading,
    error,
    createTask,
    updateTaskStatus,
    loadMore,
    refreshAll,
  };
}

export function taskCountsFromColumns(columns: Record<TaskStatus, ColumnState>): TaskCounts {
  return {
    todo: columns.todo.total,
    in_progress: columns.in_progress.total,
    done: columns.done.total,
  };
}

export function useTasks(projectId: string) {
  const board = useProjectBoard(projectId);
  return {
    tasks: board.allTasks,
    loading: board.loading,
    error: board.error,
    createTask: board.createTask,
    updateTaskStatus: board.updateTaskStatus,
    refresh: board.refreshAll,
  };
}
