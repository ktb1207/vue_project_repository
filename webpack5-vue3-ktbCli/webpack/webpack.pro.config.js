// 引入webpack-merge
const { merge } = require('webpack-merge');
// css压缩
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// 引入基础配置
const base = require('./webpack.config');

//打包前自动清空dist目录的插件----webpack5默认支持
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = merge(base('production'), {
  mode: 'production',
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vueLib: {
          filename: 'vueLib.[contenthash].js',
          test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/,
          priority: 20,
          enforce: true
        },
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10 // 拆分优先级
        }
      }
    }
  },
  plugins: [new CssMinimizerPlugin()]
});
