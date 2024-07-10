const presets = [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        modules: false, // "Tree Shaking"을 위함 ( ES6 모듈 시스템 사용 )
        useBuiltIns: "usage", // "corejs"에서 사용하는 "polyfill"만 "import"만 삽입
        corejs: 3, // 사용할 `corejs` 버전 명시
      },
    ],
    "@babel/preset-typescript",
  ];
  const plugins = [];
  
  module.exports = { presets, plugins };