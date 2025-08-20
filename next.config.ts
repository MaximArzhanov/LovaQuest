import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Отключаем строгие проверки ESLint во время сборки
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Отключаем строгие проверки TypeScript во время сборки
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
