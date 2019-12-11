'use strict'
// utils提供工具函数，包括生成处理各种样式语言的loader，获取资源文件存放路径的工具函数。
const utils = require('./utils')
const webpack = require('webpack')
    // 默认是index文件,也就是config文件里面的index.js
const config = require('../config')
    // 将基础配置和开发环境配置或者生产环境配置合并在一起的包管理
const merge = require('webpack-merge')
const path = require('path')
    // 引入基本webpack基本配置
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
    // Friendly-errors-webpack-plugin可识别某些类型的webpack错误并清理，汇总和优先化它们以提供更好的开发者体验。
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
    // 查看空闲端口位置，默认情况下搜索8000这个端口
const portfinder = require('portfinder')
    //通过webpack.DefinePlugin定义的一个全局变量process.env
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        //自动生成了css,postcss,less等规则，并进行模块转换，转换成webpack可识别的文件，进行解析转换
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },
    // cheap-module-eval-source-map is faster for development
    // 增加调试信息
    devtool: config.dev.devtool,
    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'warning', //在开发工具(DevTools)的控制台将显示消息
        historyApiFallback: { //// 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。
            rewrites: [
                { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
            ],
        },
        hot: true, //启动模块热更新特性
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true, //一切服务都启动用gzip方式进行压缩代码
        host: HOST || config.dev.host, //指定使用一个host,默认是localhost,获取HOST地址，该文件定义或config中index里的dev配置里获取
        port: PORT || config.dev.port, //指定要监听的端口号,该文件定义或config中index里的dev配置里获取
        open: config.dev.autoOpenBrowser, //发开服务器是否自动代开默认浏览器
        //当出现编译器错误或警告时，在浏览器中显示全屏叠加,覆盖到浏览器的项目页面的上方
        overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,
        //服务器假设运行在http://localhost:8080并且output.filename被设置为bundle.js默认。publicPath是"/"，所以你的包（束）通过可以http://localhost:8080/bundle.js访问。
        publicPath: config.dev.assetsPublicPath,
        //如果你有单独的后端开发服务器API，并且希望在同域名下发送API请求，那么代理某些URL将很有用.简称就是API代理,中间件  需引入 http-proxy-middleware
        proxy: config.dev.proxyTable,
        //启用quiet后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自的WebPack的错误或警告在控制台不可见。
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: { //webpack使用文件系统（file system）获取文件改动的通知
            poll: config.dev.poll,
        }
    },
    plugins: [
        //DefinePlugin将允许您创建可在配置全局常量的编译时间。这对于允许开发构建和发布构建之间的不同行为是有用的
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        // 永远不能用在生产模式，模块热更新,修改文件的内容，允许在运行时更新各种模块，而无需进行完全刷新。
        new webpack.HotModuleReplacementPlugin(),
        //当进行热更新时，相关文件名会被展示出来
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        //跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误。
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.dev.assetsSubDirectory,
            ignore: ['.*']
        }])
    ]
})

module.exports = new Promise((resolve, reject) => {
    //由于portfinder这个插件本身是从8000开始查找，这里设置查找的默认端口号
    portfinder.basePort = process.env.PORT || config.dev.port

    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            // 如果端口被占用就对进程设置端口
            process.env.PORT = port
                // add port to devServer config
                // 如果端口被占用就设置devServer的端口
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                    },
                    // 添加提示信息，所在域名和端口的提示信息
                    onErrors: config.dev.notifyOnErrors ?
                        utils.createNotifierCallback() : undefined
                }))
                // 如果找到能用的端口号，就把配置信息提示抛出去
            resolve(devWebpackConfig)
        }
    })
})