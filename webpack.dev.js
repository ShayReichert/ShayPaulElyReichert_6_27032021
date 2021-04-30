const webpack = require("webpack");
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

let config = merge(common, {
  mode: "development",

  devServer: {
    publicPath: "/",
    contentBase: path.resolve(__dirname, "./assets"),
    watchContentBase: true,
    historyApiFallback: true,
    inline: true,
    open: true,
    hot: true,
  },
  devtool: "eval-source-map",
});

module.exports = config;
