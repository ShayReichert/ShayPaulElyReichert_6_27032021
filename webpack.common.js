const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

let config = {
  entry: {
    index: "./src/index.js",
    photographer: "./src/photographer.js",
  },
  output: {
    path: path.resolve(__dirname, "./docs/"),
    publicPath: "/docs/",
    filename: "[name].[hash:20].js",
    assetModuleFilename: "images/[hash][ext][query]",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },

      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin(),

    new HtmlWebpackPlugin({
      // hash: true,
      template: "./src/index.html",
      inject: true,
      chunks: ["index"],
      filename: `index.html`,
    }),
    new HtmlWebpackPlugin({
      // hash: true,
      template: "./src/photographer.html",
      inject: true,
      chunks: ["photographer"],
      filename: `photographer.html`,
    }),

    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
          [
            "svgo",
            {
              plugins: [
                {
                  removeViewBox: false,
                },
              ],
            },
          ],
        ],
      },
    }),
  ],
};

module.exports = config;
