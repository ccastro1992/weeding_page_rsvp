/** @type {import('next').NextConfig} */
const nextConfig = {
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

