import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dreamlove.gesio.be",
      },
    ],
  },
};

export default nextConfig;