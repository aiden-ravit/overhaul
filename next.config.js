/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // API URL 환경변수 (환경별 자동 주입)
  env: {
    API_BASE_URL: process.env.API_BASE_URL, // 환경변수에서만 가져오기
    ENVIRONMENT: process.env.ENVIRONMENT || process.env.NODE_ENV || 'development',
  },
}

module.exports = nextConfig
