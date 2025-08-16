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
  // API URL 환경변수
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'https://overhaul-as-system.ravit-cloud.workers.dev',
  },
}

module.exports = nextConfig
