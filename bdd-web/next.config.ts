import type { NextConfig } from "next";
import path from "path";

// Make GH Pages settings conditional. Never "export" on Vercel runtime.
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined || process.env.VERCEL_URL !== undefined;
const isGhPages = !isVercel && process.env.NEXT_PUBLIC_DEPLOY_TARGET === "gh-pages";

// Debug logging in build time
if (process.env.NODE_ENV !== "development") {
  console.log("🔍 Build Config Debug:");
  console.log("  VERCEL:", process.env.VERCEL);
  console.log("  VERCEL_ENV:", process.env.VERCEL_ENV);
  console.log("  VERCEL_URL:", process.env.VERCEL_URL);
  console.log("  isVercel:", isVercel);
  console.log("  NEXT_PUBLIC_DEPLOY_TARGET:", process.env.NEXT_PUBLIC_DEPLOY_TARGET);
  console.log("  isGhPages:", isGhPages);
}

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
