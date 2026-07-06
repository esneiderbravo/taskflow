"use client";

import { FormEvent, useState } from "react";

interface ProjectFormProps {
  onSubmit: (name: string) => Promise<void>;
  variant?: "default" | "inline";
}

export function ProjectForm({ onSubmit, variant = "default" }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(name.trim());
      setName("");
    } finally {
      setSubmitting(false);
    }
  };

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="project-name-inline" className="sr-only">
          Project name
        </label>
        <input
          id="project-name-inline"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project name…"
          className="input-field sm:min-w-[14rem] sm:flex-1"
        />
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="btn-primary shrink-0"
        >
          {submitting ? "Creating…" : "Create"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-5">
      <div>
        <label htmlFor="project-name" className="block text-sm font-medium text-foreground">
          Project name
        </label>
        <input
          id="project-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Website redesign"
          className="input-field mt-2"
        />
      </div>
      <button
        type="submit"
        disabled={submitting || !name.trim()}
        className="btn-primary w-full sm:w-auto"
      >
        {submitting ? "Creating…" : "Create project"}
      </button>
    </form>
  );
}
