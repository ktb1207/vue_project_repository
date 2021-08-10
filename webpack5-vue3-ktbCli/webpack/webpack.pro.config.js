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
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        // css提取
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [new CssMinimizerPlugin()]
});
