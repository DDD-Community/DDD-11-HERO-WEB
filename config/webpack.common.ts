// webpack.common.ts

import path from "path";
import webpack from "webpack";

// plugin
import HtmlWebpackPlugin from "html-webpack-plugin";

const configuration: webpack.Configuration = {
  // 모듈 해석 방법 설정
  resolve: {
    // 생략할 확장자
    extensions: [".ts", ".tsx", ".js", ".jsx"],

    // 절대 경로
    alias: {
      "@src": path.resolve(__dirname, "../src/"),
    },
  },

  // 진입점
  entry: "./src/index",

  // 로더
  module: {
    rules: [
      // babel-loader ( react, ts, polyfill, 구문 변환 등을 처리 ( babel.config.js ) )
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
    ],
  },

  // 플러그인
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "..", "public", "index.html"),
    }),
    // import React from "react" 생략을 위한 플러그인 설정
    new webpack.ProvidePlugin({ React: "react" }),
  ],
};

export default configuration;