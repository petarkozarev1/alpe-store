/** @type {import('next').NextConfig} */
const nextConfig = {
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
