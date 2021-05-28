const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

let config = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "./docs"),
  },
  optimization: {
    minimize: true,
    minimizer: [`...`, new TerserPlugin()],
  },

  output: {
    clean: true,
  },
});

module.exports = config;
