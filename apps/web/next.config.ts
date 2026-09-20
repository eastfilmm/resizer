import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 워크스페이스 패키지들은 빌드 산출물 없이 TS 소스를 그대로 내보낸다.
  transpilePackages: ['@resizer/canvas', '@resizer/ui'],
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
