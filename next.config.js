/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        async_hooks: false,
        child_process: false,
        dgram: false,
        dns: false,
        http2: false,
        https: false,
        os: false,
        path: false,
        stream: false,
        util: false,
        zlib: false,
      };
    }
    
    // Handle node: protocol imports
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:async_hooks': 'async_hooks',
      'node:buffer': 'buffer',
      'node:crypto': 'crypto',
      'node:events': 'events',
      'node:fs': 'fs',
      'node:http': 'http',
      'node:https': 'https',
      'node:net': 'net',
      'node:os': 'os',
      'node:path': 'path',
      'node:process': 'process',
      'node:stream': 'stream',
      'node:url': 'url',
      'node:util': 'util',
      'node:zlib': 'zlib',
    };
    
    return config;
  },
  // Add transpilePackages to ensure Prisma client is properly transpiled
  transpilePackages: ['@prisma/client', '@auth/prisma-adapter'],
};

module.exports = nextConfig;