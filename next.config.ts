import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/mesas',
        destination: 'https://weddingseatingchart.vercel.app/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

