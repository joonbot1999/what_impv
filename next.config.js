/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    maxBodySize: '10mb'
  }
}

module.exports = nextConfig
