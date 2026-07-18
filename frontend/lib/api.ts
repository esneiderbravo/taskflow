export type TaskStatus = "todo" | "in_progress" | "done";

export interface TaskCounts {
  todo: number;
  in_progress: number;
  done: number;
}

export interface Project {
  id: string;
  name: string;
  created_at: string;
}

export interface ProjectSummary extends Project {
  task_counts: TaskCounts;
}

export interface ProjectDetail extends Project {
  task_counts: TaskCounts;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  project_id: string;
  created_at: string;
}

export interface PaginatedProjects {
  items: ProjectSummary[];
  total: number;
  task_total: number;
}

export interface PaginatedTasks {
  items: Task[];
  total: number;
}

export interface ListProjectsParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListTasksParams {
  search?: string;
  status?: TaskStatus;
  limit?: number;
  offset?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function buildQuery(params: object): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  }
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail ?? "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  listProjects: (params: ListProjectsParams = {}) =>
    request<PaginatedProjects>(`/projects${buildQuery(params)}`),
  createProject: (name: string) =>
    request<Project>("/projects", { method: "POST", body: JSON.stringify({ name }) }),
  getProject: (id: string) => request<ProjectDetail>(`/projects/${id}`),
  deleteProject: (id: string) => request<void>(`/projects/${id}`, { method: "DELETE" }),

  listTasks: (projectId: string, params: ListTasksParams = {}) =>
    request<PaginatedTasks>(`/projects/${projectId}/tasks${buildQuery(params)}`),
  createTask: (projectId: string, data: { title: string; description?: string }) =>
    request<Task>(`/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTask: (taskId: string, data: Partial<Pick<Task, "title" | "description" | "status">>) =>
    request<Task>(`/tasks/${taskId}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTask: (taskId: string) => request<void>(`/tasks/${taskId}`, { method: "DELETE" }),
};

export const PAGE_SIZE = {
  projects: 12,
  tasks: 20,
} as const;
