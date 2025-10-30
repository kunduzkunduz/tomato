import type { NextConfig } from "next";
import path from "path";

// Make GH Pages settings conditional. Never "export" on Vercel runtime.
const isVercel = process.env.VERCEL === "1";
const isGhPages = !isVercel && process.env.NEXT_PUBLIC_DEPLOY_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  ...(isGhPages ? { output: "export", trailingSlash: true } : {}),
  images: { unoptimized: true },
  // Adjust basePath/assetPrefix to the GitHub repo name
  ...(isGhPages ? { basePath: "/tomato", assetPrefix: "/tomato/" } : {}),
  // Silence monorepo root warning in dev
  outputFileTracingRoot: path.join(__dirname, ".."),
  // Allow export even if ESLint finds warnings/errors (does not affect dev)
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
