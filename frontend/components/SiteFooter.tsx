const API_DOCS_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/docs`;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-surface-border bg-surface-raised">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground-muted">
          TaskFlow — project and task management for spec-driven development.
        </p>
        <a
          href={API_DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-foreground-muted transition hover:text-accent"
        >
          API documentation
        </a>
      </div>
    </footer>
  );
}
