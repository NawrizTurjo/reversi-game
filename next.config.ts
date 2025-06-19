import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  basePath: '/reversi-game', // replace <your-repo-name> with your actual repo
  assetPrefix: '/reversi-game/', // to load assets correctly
};

export default nextConfig;
