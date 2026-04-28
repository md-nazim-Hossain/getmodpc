import type { NextConfig } from 'next';

import withPlaiceholder from '@plaiceholder/next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'liteapks.com',
      },
      {
        protocol: 'https',
        hostname: 'w3a3.c5.e2-10.dev',
      },
      {
        protocol: 'https',
        hostname: 'play-lh.googleusercontent.com',
      },
    ],
  },
  turbopack: {},
};

export default withPlaiceholder(nextConfig);
