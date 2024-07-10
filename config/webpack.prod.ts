// webpack.prod.ts

import path from "path";
import webpack from "webpack";
import { merge } from "webpack-merge";
import common from "./webpack.common";

// plugin
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const configuration: webpack.Configuration = {
  mode: "production",
  devtool: "cheap-module-source-map",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[contenthash].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  optimization: {
    usedExports: true, // 사용하지 않는 "export" 제거
    minimize: true, // "minimizer"에 지정한 플러그인을 사용하여 번들 최소화
    minimizer: [new CssMinimizerPlugin()], // 최적화에 사용할 플러그인 적용
  },
};

export default merge(common, configuration);