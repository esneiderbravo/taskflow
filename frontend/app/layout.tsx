import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskFlow - Project & Task Management",
  description:
    "Lightweight project and task management demo for the PyCon 2026 workshop: Beyond Vibe Coding, Spec-Driven Development with Code Graphs.",
};

const API_DOCS_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/docs`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrains.variable}`}>
      <body>
        <div className="flex min-h-[100dvh] flex-col">
          <header className="sticky top-0 z-10 border-b border-surface-border bg-surface-raised/90 shadow-header backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
              <Link href="/" className="group flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-white">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                    />
                  </svg>
                </span>
                <span className="font-display text-xl font-bold tracking-tight text-foreground">
                  Task<span className="text-accent">Flow</span>
                </span>
              </Link>
              <span className="hidden rounded-full bg-page px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-foreground-faint sm:inline">
                PyCon 2026
              </span>
            </div>
          </header>

          <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10 sm:py-12">{children}</main>

          <footer className="border-t border-surface-border bg-surface-raised">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5 text-sm text-foreground-faint">
              <span>Spec-Driven Development</span>
              <a
                href={API_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground-muted transition hover:text-accent"
              >
                API docs
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
