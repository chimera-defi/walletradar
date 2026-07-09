/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Static export for AWS Amplify static hosting
  // This generates a fully static site in the 'out' directory
  output: 'export',

  // Enable trailing slashes for clean URLs
  trailingSlash: true,

  // Static-export response headers must be configured at the hosting layer.
  // Next.js runtime headers are not applied to files emitted in out/.

  // Webpack configuration for node modules used at build time
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
};

module.exports = nextConfig;
