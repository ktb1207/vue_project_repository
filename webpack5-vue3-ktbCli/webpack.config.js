const path = require('path');
//打包前自动清空dist目录的插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// html创建
const HtmlWebpackPlugin = require('html-webpack-plugin');
// vue-loader
const { VueLoaderPlugin } = require('vue-loader');
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:8].js'
  },
  module: {
    // 模块配置
    rules: [
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        use: {
          loader: 'babel-loader?cacheDirectory'
        }
      },
      {
        test: /\.vue$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'welcome ktbCli for vue3',
      template: path.resolve(__dirname, 'public/index.html')
    })
  ]
}