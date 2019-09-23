'use strict'

const { resolve } = require('path')
const WNE = require('webpack-node-externals')

module.exports = (_env, { mode }) => {
  // const DEV = mode !== 'development'
  const cfg = {
    target: 'node',
    mode,
    entry: resolve('./'),
    output: {
      path: resolve('dist/'),
      filename: 'index.js'
    },
    node: {
      __dirname: false,
      __filename: false
    },
    externals: [WNE()],
    stats: 'minimal'
  }
  return cfg
}
