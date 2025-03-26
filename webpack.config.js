const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add Node.js polyfills
  config.plugins.push(new NodePolyfillPlugin());

  // Fallback for Node.js globals
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve('process/browser'),
    buffer: require.resolve('buffer/'),
    "fs": false,
    "path": require.resolve("path-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "url": require.resolve("url/")
  };

  return config;
};