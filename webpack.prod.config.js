var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

var MINIFIED = process.env.DIST || null;
var filename = MINIFIED ?'relayr-browser-sdk.min.js': "relayr-browser-sdk.js";

module.exports = {
  entry: [
    './src/main.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: filename, //minified bundle excludes node modules
    library: 'relayr',
    libraryTarget: 'umd',
  },
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel']
    }]
  },
  plugins: MINIFIED ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ] : []
};
