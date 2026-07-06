"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, description?: string) => Promise<void>;
}

export function AddTaskModal({ open, onClose, onSubmit }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setTitle("");
    setDescription("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(title.trim(), description.trim() || undefined);
      reset();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add task"
      description="Describe the work to track on the board."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="modal-task-title" className="block text-sm font-medium text-foreground">
            Title
          </label>
          <input
            id="modal-task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="input-field mt-2"
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="modal-task-description" className="block text-sm font-medium text-foreground">
            Description <span className="font-normal text-foreground-faint">(optional)</span>
          </label>
          <textarea
            id="modal-task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add context or acceptance criteria"
            rows={3}
            className="input-field mt-2 resize-none"
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-surface-border pt-4">
          <button type="button" onClick={handleClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting || !title.trim()} className="btn-primary">
            {submitting ? "Adding…" : "Add task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
