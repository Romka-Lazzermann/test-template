import type {NextConfig} from 'next';
const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: `tripointhome.com`,
        port: '',
        pathname: '/api/assets/**',
      }
    ],
  },
};

export default nextConfig;
