/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  basePath: '/scm-repository-catalogue',
  assetPrefix: '/scm-repository-catalogue/',
}

module.exports = nextConfig
