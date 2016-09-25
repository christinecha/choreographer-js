var webpack = require('webpack')

module.exports = {
  entry: "./dist",
  output: {
    publicPath: "/dist/",
    path: __dirname + "/dist/",
    filename: "choreographer.min.js"
  },
  module: {
    test: /\*.js/,
    loader: "babel-loader",
    exclude: "/node_modules/"
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ]
}
