// 引入webpack-merge
const { merge } = require('webpack-merge');
// 引入基础配置
const base = require('./webpack.config');

//打包前自动清空dist目录的插件----webpack5默认支持
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = merge(base('production'), {
  mode: 'production',
  plugins: []
});
