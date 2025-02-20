/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: false, // noble-hashes doesn't require crypto polyfill
    stream: false, // require.resolve("stream-browserify") can be polyfilled here if needed
    assert: false, // require.resolve("assert") can be polyfilled here if needed
    http: false, // require.resolve("stream-http") can be polyfilled here if needed
    https: false, // require.resolve("https-browserify") can be polyfilled here if needed
    os: false, // require.resolve("os-browserify") can be polyfilled here if needed
    url: false, // require.resolve("url") can be polyfilled here if needed
    zlib: false, // require.resolve("browserify-zlib") can be polyfilled here if needed
    fs: false,
    path: false,
  });
  config.resolve.fallback = fallback;

  // Configure noble-hashes imports
  config.resolve.alias = {
    ...config.resolve.alias,
    '@noble/hashes/sha3': '@noble/hashes/sha3',  // Use the package's exports field
    '@noble/hashes/sha256': '@noble/hashes/sha256',
    '@noble/hashes/utils': '@noble/hashes/utils'
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);
  config.ignoreWarnings = [/Failed to parse source map/];
  config.module.rules.push({
    test: /\.(js|mjs|jsx)$/,
    enforce: 'pre',
    loader: require.resolve('source-map-loader'),
    resolve: {
      fullySpecified: false,
    },
  });
  
  // Add support for proper ESM handling
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
      fallback: {
        crypto: false,
      }
    },
  });

  // Ensure noble-hashes is properly transpiled
  config.module.rules.push({
    test: /node_modules\/@noble\/hashes\/.*\.js$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-runtime']
    }
  });
  return config;
};
