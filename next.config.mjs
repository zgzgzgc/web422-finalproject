import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const nextConfig = {
  env: {
    STEAM_API_KEY: process.env.STEAM_API_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: 'http://localhost:3000/auth/:path*', // Replace 5000 with the port your Express server is running on
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        module: false,
      };
    }
    return config;
  },
};

export default nextConfig;
