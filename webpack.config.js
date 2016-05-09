var webpack = require("webpack");

module.exports = {
    entry: ['./lib/djvi.js'],
    target: 'node',
    output: {
        library: 'djvi',
        libraryTarget: 'umd',
        filename: 'djvi.js',
        sourceMapFilename: '[file].map'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};