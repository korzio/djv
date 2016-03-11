var webpack = require("webpack");

module.exports = {
    entry: ['./lib/djv.js'],
    output: {
        path: __dirname + '/dist',
        filename: 'djv.js',
        sourceMapFilename: '[file].map'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};