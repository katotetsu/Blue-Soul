/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Exclude Firebase Functions directory from webpack bundling
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/functions/**'],
    };
    
    return config;
  },
  
  // Explicitly exclude functions directory from build
  experimental: {
    outputFileTracingExcludes: {
      '*': ['./functions/**/*'],
    },
  },
};

module.exports = nextConfig; 