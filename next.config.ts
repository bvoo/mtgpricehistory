import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.mtgstocks.com',
      },
    ],
  },
};

export default nextConfig;
