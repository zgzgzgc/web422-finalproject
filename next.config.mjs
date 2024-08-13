import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const nextConfig = {
  env: {
    STEAM_API_KEY: process.env.STEAM_API_KEY,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],  // Ensure it picks up all relevant page extensions
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        module: false,
      };
    }
    return config;
  },
  experimental: {
    appDir: true, // Ensures Next.js uses the `src` directory structure
  },
};

export default nextConfig;
