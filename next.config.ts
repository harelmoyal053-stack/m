import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/m",
  images: { unoptimized: true },
};

export default nextConfig;
