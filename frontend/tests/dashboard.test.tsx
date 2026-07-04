import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/StatusBadge";
import { ProjectCard } from "@/components/ProjectCard";

describe("StatusBadge", () => {
  it("renders Ready for todo status", () => {
    render(<StatusBadge status="todo" />);
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("renders In Progress for in_progress status", () => {
    render(<StatusBadge status="in_progress" />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });
});

describe("ProjectCard", () => {
  it("renders project name and link", () => {
    render(
      <ProjectCard
        project={{
          id: "abc-123",
          name: "Web App Launch",
          created_at: "2026-01-15T10:00:00Z",
        }}
      />
    );
    expect(screen.getByText("Web App Launch")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/projects/abc-123");
  });
});
