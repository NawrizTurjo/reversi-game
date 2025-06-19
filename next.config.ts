import type { NextConfig } from "next";

const nextConfig = {
  // output: 'export',         // important for static export
  // basePath: '/reversi-game', // your repo name here
  // assetPrefix: '/reversi-game/',
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
