import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Android looks for this exact path. The handler lives under /api
      // because the app router ignores folders whose name starts with a dot.
      { source: "/.well-known/assetlinks.json", destination: "/api/assetlinks" },
    ];
  },
};

export default nextConfig;
