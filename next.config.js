/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        "fs": false,
        "path": false,
        "os": false,
      }
    }
    return config
  },
  experimental: {
    serverMinification: false,
  },
  images: {
    domains: ['v5.airtableusercontent.com'],
  },
}

module.exports = nextConfig
