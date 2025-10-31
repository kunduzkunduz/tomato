import type { NextConfig } from "next";
import path from "path";

// Make GH Pages settings conditional. Never "export" on Vercel runtime.
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;
const isGhPages = !isVercel && process.env.NEXT_PUBLIC_DEPLOY_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  // NEVER use static export on Vercel - explicitly disable
  ...(isGhPages && !isVercel ? { output: "export", trailingSlash: true } : {}),
  images: { unoptimized: true },
  // Adjust basePath/assetPrefix to the GitHub repo name (only for GH Pages)
  ...(isGhPages && !isVercel ? { basePath: "/tomato", assetPrefix: "/tomato/" } : {}),
  // Silence monorepo root warning in dev
  outputFileTracingRoot: path.join(__dirname, ".."),
  // Allow export even if ESLint finds warnings/errors (does not affect dev)
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
