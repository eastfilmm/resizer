import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  experimental: {
    // @ts-expect-error - Next.js 15+ feature, type might be missing in some versions
    allowedDevOrigins: ['localhost'],
  },
};

export default nextConfig;
