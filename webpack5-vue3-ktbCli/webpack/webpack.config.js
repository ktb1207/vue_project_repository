const path = require('path');
// html创建
const HtmlWebpackPlugin = require('html-webpack-plugin');
// vue-loader
const { VueLoaderPlugin } = require('vue-loader');
// 提取css
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
// ts
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// fork ts
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const handleUrl = (str) => {
  return path.resolve(__dirname, `../${str}`);
};
module.exports = (env) => {
  const devMode = () => {
    return env === 'development';
  };
  return {
    entry: handleUrl('src/main.js'),
    output: {
      path: handleUrl('dist'),
      pathinfo: false,
      // contenthash利于静态文件缓存
      filename: '[name].[contenthash].js',
      // clean dist
      clean: true
    },
    resolve: {
      alias: {
        '@': handleUrl('src')
      },
      extensions: ['.js', '.ts', '.vue', '.jsx', '.tsx'],
      modules: [handleUrl('node_modules')],
      plugins: [new TsconfigPathsPlugin({ baseUrl: handleUrl('tsconfig.json') })],
      symlinks: false
    },
    module: {
      // 模块配置
      rules: [
        {
          test: /\.(js)x?$/,
          include: [handleUrl('src')],
          exclude: [handleUrl('node_modules')],
          use: ['babel-loader?cacheDirectory', 'eslint-loader']
        },
        // {
        //   test: /\.(ts)x?$/,
        //   include: [handleUrl('src')],
        //   exclude: [handleUrl('node_modules')],
        //   use: [
        //     'ts-loader',
        //     {
        //       options: {
        //         transpileOnly: true,
        //         appendTsSuffixTo: ['\\.vue$'],
        //         happyPackMode: true
        //       }
        //     }
        //   ]
        // },
        {
          test: /\.vue$/,
          include: [handleUrl('src')],
          loader: 'vue-loader'
        },
        {
          test: /\.css$/i,
          include: [handleUrl('src')],
          // use: ['style-loader', 'css-loader']
          // vue-style-loader 跟 style-loader 基本用法跟功能是一样的，都是往 dom 里面插入一个 style 标签去让样式生效的
          // 但是 vue-style-loader 支持 vue 中的 ssr（服务端渲染），所以如果需要支持服务端渲染的 vue 项目，就需要用到 vue-style-loader了
          // 如果一般的 vue 项目的话，推荐使用 style-loader，毕竟 style-loader 支持的功能还是丰富
          use: [
            devMode() ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  // 配置文件路径
                  config: handleUrl('postcss.config.js')
                }
              }
            }
          ]
        },
        {
          test: /\.scss$/i,
          include: [handleUrl('src')],
          use: [
            devMode() ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  // 配置文件路径
                  config: handleUrl('postcss.config.js')
                }
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.less$/i,
          include: [handleUrl('src')],
          use: [
            devMode() ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  // 配置文件路径
                  config: handleUrl('postcss.config.js')
                }
              }
            },
            'less-loader'
          ]
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: '[name]_[hash:8].[ext]', // 使用图片的名字，并使用图片的后缀
                limit: 8192
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        async: true,
        typescript: {
          configFile: handleUrl('tsconfig.json'),
          extensions: {
            vue: {
              compiler: '@vue/compiler-sfc'
            }
          }
        }
      }),
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        title: 'welcome ktbCli for vue3',
        template: handleUrl('public/index.html')
      })
    ].concat(
      devMode()
        ? []
        : [
            new MiniCssExtractPlugin({
              filename: '[name].[contenthash].css',
              chunkFilename: '[id].[contenthash].css'
            })
          ]
    )
  };
};
