const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add polyfills for web compatibility
config.resolver.extraNodeModules = {
  crypto: require.resolve("crypto-browserify"),
  buffer: require.resolve("buffer"),
  stream: require.resolve("stream-browserify"),
  util: require.resolve("util"),
  // Add Babel runtime helpers
  '@babel/runtime/helpers/interopRequireDefault': require.resolve('@babel/runtime/helpers/interopRequireDefault'),
  '@babel/runtime/helpers/interopRequireWildcard': require.resolve('@babel/runtime/helpers/interopRequireWildcard'),
  '@babel/runtime/helpers/typeof': require.resolve('@babel/runtime/helpers/typeof'),
};

// Simple resolver configuration
config.resolver.alias = {
  '@noble/hashes/crypto': require.resolve('crypto-browserify'),
  '@noble/hashes': require.resolve('@noble/hashes'),
  // Add Babel runtime aliases
  '@babel/runtime/helpers/interopRequireDefault': require.resolve('@babel/runtime/helpers/interopRequireDefault'),
  '@babel/runtime/helpers/interopRequireWildcard': require.resolve('@babel/runtime/helpers/interopRequireWildcard'),
  '@babel/runtime/helpers/typeof': require.resolve('@babel/runtime/helpers/typeof'),
};

module.exports = config;