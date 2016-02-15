// you can use this file to add your custom webpack plugins, loaders and
// anything you like.  This is just the basic way to add additional webpack
// configurations.  For more information refer the docs:
// https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT When you add this file, we won't add the default configurations
// which is similar to "React Create App". This only has babel loader to load
// JavaScript.

const merge = require('webpack-merge')
const parts = require('../webpack/webpack.config.parts')

module.exports = ({ config }) =>
  merge(
    config,
    // This is to enable the latest-and-greatest in RHL, as per
    // https://github.com/gaearon/react-hot-loader#webpack-plugin.
    {
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            include: /node_modules/,
            use: ['react-hot-loader/webpack'],
          },
        ],
      },
    },
    parts.loadStylus()
  )
