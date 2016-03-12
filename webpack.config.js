var webpack = require("webpack");

module.exports = {
    entry: ['./lib/djv.js'],
    target: 'node',
    output: {
        path: __dirname + '/dist',
        library: 'djv',
        libraryTarget: 'umd',
        filename: 'djv.js',
        sourceMapFilename: '[file].map'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};