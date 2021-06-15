module.exports = {
  plugins: [
    [
      "postcss-short", 
      { prefix: "x" }
    ],
    ["postcss-preset-env",
      {
        // 其他选项
      },
    ],
    [
      'autoprefixer'
    ],
    [
      'postcss-import'
    ]
  ],
  execute: true,
};