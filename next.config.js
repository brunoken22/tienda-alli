/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["sequelize", "pg", "pg-hstore"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
