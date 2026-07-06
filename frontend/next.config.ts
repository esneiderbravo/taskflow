import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin tracing to frontend/ so the repo-root package-lock.json is not picked up.
  outputFileTracingRoot: frontendRoot,
  ...(process.env.NODE_ENV === "production" ? { output: "standalone" as const } : {}),
};

export default nextConfig;
