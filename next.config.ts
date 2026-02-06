import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
};

export default nextConfig;
