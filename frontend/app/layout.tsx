import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskFlow — Project & Task Management",
  description:
    "Lightweight project and task management demo for the PyCon 2026 workshop: Beyond Vibe Coding — Spec-Driven Development with Code Graphs.",
};

const API_DOCS_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/docs`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 border-b border-surface-border/80 bg-surface/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <Link href="/" className="group flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                  <svg
                    className="h-4 w-4 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </span>
                <span className="text-lg font-semibold tracking-tight text-white">
                  Task<span className="text-accent">Flow</span>
                </span>
              </Link>
              <span className="hidden rounded-full border border-surface-border bg-surface-raised px-3 py-1 text-xs font-medium tracking-wide text-slate-400 sm:inline">
                PyCon 2026 Workshop
              </span>
            </div>
          </header>

          <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>

          <footer className="border-t border-surface-border/60 bg-surface-raised/30">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-xs text-slate-500">
              <span>Spec-Driven Development with Code Graphs</span>
              <a
                href={API_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-accent"
              >
                API Docs →
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
