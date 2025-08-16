/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 단일 워커에서 SSR 실행
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
