/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['animejs'],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'figment-mcp': require('path').resolve(__dirname, '../core/dist'),
    };
    return config;
  },
}

module.exports = nextConfig