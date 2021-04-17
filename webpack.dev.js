const webpack = require("webpack");
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

let config = merge(common, {
  mode: "development",

  devServer: {
    contentBase: path.resolve(__dirname, "./src"),
    watchContentBase: true,
    historyApiFallback: true,
    inline: true,
    open: true,
    hot: true,
  },
  devtool: "eval-source-map",
});

module.exports = config;