import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable webpack 5 features that might cause issues
  webpack: (config, { isServer }) => {
    // Fix for MetaMask SDK and other browser-only packages
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-select'],
  },

  // Disable source maps in production to reduce build size
  productionBrowserSourceMaps: false,

  // Image optimization with remote patterns (new syntax)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'owna.io',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
  poweredByHeader: false,

  // Compression
  compress: true,

  // Handle transpilation for problematic packages
  transpilePackages: ['@coinbase/onchainkit'],
};

export default nextConfig;
