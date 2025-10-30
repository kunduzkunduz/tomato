import type { NextConfig } from "next";
import path from "path";

// Make GH Pages settings conditional so local/Vercel dev works seamlessly
const isGhPages = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  ...(isGhPages ? { output: "export", trailingSlash: true } : {}),
  images: { unoptimized: true },
  ...(isGhPages ? { basePath: "/domates", assetPrefix: "/domates/" } : {}),
  // Silence monorepo root warning in dev
  outputFileTracingRoot: path.join(__dirname, ".."),
  // Allow export even if ESLint finds warnings/errors (does not affect dev)
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
