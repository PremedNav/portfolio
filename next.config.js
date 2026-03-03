/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
};

export default nextConfig;
