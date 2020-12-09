module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    // element 按需引入
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    // vant 按需引入
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ]
};
