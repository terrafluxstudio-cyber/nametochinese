import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin workspace root to this project dir. A stray root-owned
  // package-lock.json in the home dir was making Next infer the wrong
  // root and resolve postcss/enhanced-resolve from the wrong node_modules.
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: '/en', destination: '/search', permanent: true },
      { source: '/en/:path*', destination: '/search/:path*', permanent: true },
      { source: '/naming-rules/sinosphere', destination: '/naming-rules', permanent: true },
    ];
  },
};

export default nextConfig;
