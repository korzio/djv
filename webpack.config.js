var webpack = require("webpack");

module.exports = {
    entry: ['./lib/djv.js'],
    target: 'node',
    output: {
        library: 'djv',
        libraryTarget: 'umd',
        filename: 'djv.js',
        sourceMapFilename: '[file].map'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};