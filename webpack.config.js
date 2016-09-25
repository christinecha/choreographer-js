module.exports = {
  entry: "./demo",
  output: {
    publicPath: "/demo/",
    path: __dirname + "/demo",
    filename: "bundle.js"
  },
  module: {
    test: /\*.js/,
    loader: "babel-loader",
    exclude: '/node_modules/'
  }
}
