/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'alpewear.com' }],
        destination: 'https://www.ampewear.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.alpewear.com' }],
        destination: 'https://www.ampewear.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'ampewear.com' }],
        destination: 'https://www.ampewear.com/:path*',
        permanent: true,
      },
    ]
  },
  env: {
    // Inlined for client components so the review guard matches the Vercel environment.
    VERCEL_ENV: process.env.VERCEL_ENV ?? 'development',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

export default nextConfig;
