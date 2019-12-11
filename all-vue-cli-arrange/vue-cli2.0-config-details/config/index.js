'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.
//config文件夹下，最主要的就是index.js文件，保存着开发环境和生产环境所需要的信息。 
const path = require('path')

module.exports = {
    dev: {

        // Paths
        assetsSubDirectory: 'static', // 二级目录，存放静态资源文件的目录，位于dist文件夹下
        // 发布路径，如果构建后的产品文件有用于CDN或者放到其他域名服务器，可以在这里设置，当然本地打包，本地浏览一般都将这里设置为"./"
        assetsPublicPath: '/',
        proxyTable: {}, //代理

        // Various Dev Server settings
        host: 'localhost', // can be overwritten by process.env.HOST
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: true, // 是否自动打开浏览器
        errorOverlay: true, // 当出现编译器错误或警告时，在浏览器中显示全屏叠加,覆盖到浏览器的项目页面的上方
        notifyOnErrors: true, // 是否允许窗口弹出错误信息
        // webpack使用文件系统（file system）获取文件改动的通知
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'cheap-module-eval-source-map', // 开启调试的类型

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true, // 是否通过将哈希查询附加到文件名来生成具有缓存清除的源映射

        cssSourceMap: false // 开发环境下，不显示cssSourceMap
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html'), //  获得绝对路径，inde.html的模板文件

        // Paths
        assetsRoot: path.resolve(__dirname, '../dist'), // 获得dist文件夹的绝对路径
        assetsSubDirectory: 'static', // 二级目录
        // 发布路径，如果构建后的产品文件有用于CDN或者放到其他域名服务器，可以在这里设置，当然本地打包，本地浏览一般都将这里设置为"./"
        assetsPublicPath: './',

        /**
         * Source Maps
         */

        productionSourceMap: true, // production环境下生成sourceMap文件
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map', // 开启调试的类型

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        // gzip模式下需要压缩的文件的扩展名，设置js、css之后就只会对js和css文件进行压
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        // 是否展示webpack构建打包之后的分析报告
        bundleAnalyzerReport: process.env.npm_config_report
    }
}