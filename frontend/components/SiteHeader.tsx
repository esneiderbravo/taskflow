import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-surface-border bg-surface-raised/95 shadow-header backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition group-hover:bg-accent-light">
            <svg
              className="h-[18px] w-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 5.25v2.25m0 0H6m4.5 0h9.75A2.25 2.25 0 0 1 22.5 9.75v9.75A2.25 2.25 0 0 1 20.25 21H6A2.25 2.25 0 0 1 3.75 18.75V9.75A2.25 2.25 0 0 1 6 7.5h4.5Z"
              />
            </svg>
          </span>
          <span className="font-semibold tracking-tight text-foreground">
            Task<span className="text-accent">Flow</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <nav aria-label="Main" className="flex items-center gap-1">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition hover:bg-page hover:text-accent"
            >
              Projects
            </Link>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground-muted transition hover:bg-page hover:text-accent"
            >
              API
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
