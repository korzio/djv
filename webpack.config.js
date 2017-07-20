const webpack = require('webpack');

module.exports = {
  entry: ['./lib/djv.js'],
  target: 'node',
  output: {
    library: 'djv',
    libraryTarget: 'umd',
    filename: 'djv.js',
    sourceMapFilename: '[file].map'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
};
