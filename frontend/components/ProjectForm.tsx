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
      className="flex flex-col gap-3 rounded-xl border border-surface-border bg-surface-raised/50 p-4 sm:flex-row"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter project name..."
        aria-label="Project name"
        className="flex-1 rounded-lg border border-surface-border bg-surface px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={submitting || !name.trim()}
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-surface transition hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Creating…" : "Create Project"}
      </button>
    </form>
  );
}
