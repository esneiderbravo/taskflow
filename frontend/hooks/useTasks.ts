"use client";

import { useCallback, useEffect, useState } from "react";
import { api, Project, Task } from "@/lib/api";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await api.listProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createProject = async (name: string) => {
    const project = await api.createProject(name);
    setProjects((prev) => [...prev, project]);
    return project;
  };

  return { projects, loading, error, refresh, createProject };
}

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await api.listTasks(projectId);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTask = async (title: string, description?: string) => {
    const task = await api.createTask(projectId, { title, description });
    setTasks((prev) => [...prev, task]);
    return task;
  };

  const updateTaskStatus = async (taskId: string, status: Task["status"]) => {
    const updated = await api.updateTask(taskId, { status });
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    return updated;
  };

  return { tasks, loading, error, refresh, createTask, updateTaskStatus };
}
