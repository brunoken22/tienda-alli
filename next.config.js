/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
      },
    };
    return config;
  },
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     // No externalizar pg y otras dependencias del servidor
  //     config.externals = config.externals || [];
  //     config.externals = config.externals.filter((external) => {
  //       return typeof external !== "string" || !["pg", "pg-hstore", "sequelize"].includes(external);
  //     });
  //   }
  //   return config;
  // },

  experimental: {
    serverMinification: false,
    serverComponentsExternalPackages: ["sequelize", "pg", "pg-hstore"],
  },
  images: {
    domains: ["v5.airtableusercontent.com", "res.cloudinary.com"],
  },
};

module.exports = nextConfig;
