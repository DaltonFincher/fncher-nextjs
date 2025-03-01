import { NextConfig } from 'next';
import { WebpackConfigContext } from 'next/dist/server/config-shared';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  webpack(config: any, { isServer }: WebpackConfigContext) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/old-signup',
        destination: '/signup-agent',
        permanent: true,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
