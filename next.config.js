/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["sequelize", "pg", "pg-hstore"],
  images: {
    domains: ["v5.airtableusercontent.com", "res.cloudinary.com", "localhost"],
  },
};

module.exports = nextConfig;
