import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  // External packages configuration
  serverExternalPackages: ['@prisma/client'],
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Optimize images
  images: {
    domains: ['localhost'],
  },
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable strict mode
  reactStrictMode: true,
  // Optimize build output
  output: 'standalone',
  // Enable compression
  compress: true,
  // Optimize memory usage
  poweredByHeader: false,
};

export default nextConfig;
