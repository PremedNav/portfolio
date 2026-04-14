/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.STATIC_EXPORT === '1' ? { output: 'export' } : {}),
  async redirects() {
    return [
      {
        source: '/recommendations',
        destination: '/recommendation',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/widgets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/models/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/logos/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
