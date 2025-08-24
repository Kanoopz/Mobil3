const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add minimal polyfills for web compatibility
config.resolver.extraNodeModules = {
  crypto: require.resolve("crypto-browserify"),
  buffer: require.resolve("buffer"),
  stream: require.resolve("stream-browserify"),
  util: require.resolve("util"),
};

// Simple resolver configuration
config.resolver.alias = {
  '@noble/hashes/crypto': require.resolve('crypto-browserify'),
};

module.exports = config;