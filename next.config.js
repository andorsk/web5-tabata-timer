const webpack = require("webpack");

const withPWA = require("next-pwa")({
  dest: "public",
  customWorkerDir: "src/workers",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "dist",
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/login",
        destination: "/LoginScreen",
      },
      {
        source: "/play",
        destination: "/PlayScreen",
      },
      {
        source: "/activity",
        destination: "/ActivityScreen",
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          process: "process/browser",
        }),
        new webpack.NormalModuleReplacementPlugin(/node:crypto/, (resource) => {
          resource.request = resource.request.replace(/^node:/, "");
        }),
      );
    }
    return config;
  },
};

module.exports = withPWA(nextConfig);
