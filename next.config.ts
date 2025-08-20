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

  // Оптимизации для Vercel
  output: 'standalone',
  
  // Оптимизация изображений
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },

  // Оптимизация сборки
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Заголовки безопасности
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
