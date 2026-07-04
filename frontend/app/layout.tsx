import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-mono",
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
    <html
      lang="en"
      className={`${fraunces.variable} ${ibmPlex.variable} ${ibmMono.variable}`}
    >
      <body>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 border-b border-surface-border/60 bg-ink/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
              <Link href="/" className="group flex items-center gap-3">
                <span className="relative flex h-9 w-9 items-center justify-center">
                  <span className="absolute inset-0 rounded-md border border-brass/30 bg-brass/10" />
                  <svg
                    className="relative h-4 w-4 text-brass"
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
                <span className="font-display text-xl font-semibold tracking-tight text-cream">
                  Task<span className="text-brass">Flow</span>
                </span>
              </Link>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-cream-faint sm:inline">
                PyCon 2026
              </span>
            </div>
          </header>

          <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">{children}</main>

          <footer className="border-t border-surface-border/40">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5 font-mono text-[11px] text-cream-faint">
              <span>Spec-Driven Development</span>
              <a
                href={API_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-brass"
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
