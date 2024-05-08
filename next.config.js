const webpack = require("webpack");
const runtimeCaching = require("next-pwa/cache");
const path = require("path");

const withPWA = require("next-pwa")({
  dest: "public",
  customWorkerDir: "src/workers",
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/, "/app-build-manifest.json$/"],
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
    const registerJs = path.join(
      path.dirname(require.resolve("next-pwa")),
      "register.js",
    );
    const entry = config.entry;

    config.entry = () =>
      entry().then((entries) => {
        // Automatically registers the SW and enables certain `next-pwa` features in
        // App Router (https://github.com/shadowwalker/next-pwa/pull/427)
        if (entries["main-app"] && !entries["main-app"].includes(registerJs)) {
          if (Array.isArray(entries["main-app"])) {
            entries["main-app"].unshift(registerJs);
          } else if (typeof entries["main-app"] === "string") {
            entries["main-app"] = [registerJs, entries["main-app"]];
          }
        }
        return entries;
      });

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
