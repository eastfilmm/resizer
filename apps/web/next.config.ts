import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @resizer/canvas는 빌드 산출물 없이 TS 소스를 그대로 내보낸다.
  transpilePackages: ['@resizer/canvas'],
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
