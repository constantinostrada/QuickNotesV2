import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enforce module path aliases defined in tsconfig.json
  experimental: {},
};

export default nextConfig;
