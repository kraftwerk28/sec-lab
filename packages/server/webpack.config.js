'use strict';

const { resolve } = require('path');
const externals = require('webpack-node-externals');

module.exports = (_env, { mode }) => {
  const DEV = mode === 'development';
  const cfg = {
    target: 'node',
    mode,
    entry: {
      index: resolve('./'),
      tests: resolve('./tests')
    },
    output: {
      path: resolve('dist/'),
      filename: '[name].js'
    },
    node: {
      __dirname: false,
      __filename: false
    },
    externals: [externals()],
    stats: 'minimal',
    devtool: DEV ? 'source-map' : false
  };
  return cfg;
};
