module.exports = {
  entry: "./demo",
  output: {
    path: __dirname + "/demo",
    filename: "bundle.js"
  },
  module: {
    test: /\*.js/,
    loader: "babel-loader",
    exclude: '/node_modules/'
  }
}
