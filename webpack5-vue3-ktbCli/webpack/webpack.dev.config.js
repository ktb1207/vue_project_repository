const path = require('path');
// 引入webpack
const webpack = require('webpack');
// 引入webpack-merge
const { merge } = require('webpack-merge');
// 引入基础配置
const base = require('./webpack.config');
// 路径处理
const handleUrl = (str) => {
  return path.resolve(__dirname, `../${str}`)
}
module.exports = merge(base, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: handleUrl('dist'),
    compress: false,
    // 启用热更新
    hot: true,
    hotOnly: true,
    // 出现编译器错误或警告时，在浏览器中显示全屏覆盖。 如果只想显示编译器错误：
    overlay: true,
    open: true,
    port: 9000,
    index: 'index.html',
    // 打开页面
    openPage: '',
    // 代理
    proxy: {}
  }
})