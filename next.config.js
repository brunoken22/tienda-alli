/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverMinification: false,
  },
    images: {
        domains: ['v5.airtableusercontent.com'],
      },
}

module.exports = nextConfig
