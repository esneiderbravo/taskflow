"use client";

import { FormEvent, useState } from "react";

interface ProjectFormProps {
  onSubmit: (name: string) => Promise<void>;
}

export function ProjectForm({ onSubmit }: ProjectFormProps) {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
        aria-label="Project name"
        className="input-field flex-1"
      />
      <button
        type="submit"
        disabled={submitting || !name.trim()}
        className="btn-primary shrink-0"
      >
        {submitting ? "Creating…" : "Create project"}
      </button>
    </form>
  );
}
