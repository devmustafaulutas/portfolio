import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@portfolio/ui", "@portfolio/sdk"],
};

export default nextConfig;
