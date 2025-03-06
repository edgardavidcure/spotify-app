import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
module.exports = {
  images: {
    domains: ["i.scdn.co", "doxl99efvuscymc8.public.blob.vercel-storage.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "doxl99efvuscymc8.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
};
