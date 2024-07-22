/** @type {import('next').NextConfig} */
//solving the parsing error
// next.config.mjs

const nextConfig = {
  webpack(config, { isServer }) {
    // Add a rule to handle .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader', // or any appropriate loader that skips processing
    });

    return config;
  },
};

export default nextConfig;



