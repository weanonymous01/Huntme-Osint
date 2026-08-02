/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.efferd.com',
      },
      {
        protocol: 'https',
        hostname: 'shadcnblocks.com',
      },
      {
        protocol: 'https',
        hostname: 'www.shadcnblocks.com',
      },
    ],
  },
};

export default nextConfig;
