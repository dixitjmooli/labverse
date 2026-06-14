import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    ".space-z.ai",
    "preview-chat-46a2b692-8106-41b4-a1d8-92f6561de897.space-z.ai",
  ],
};

export default nextConfig;
