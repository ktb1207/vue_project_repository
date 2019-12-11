'use strict'
// node.js的文件路径，用来处理文件当中的路径问题
const path = require('path')
    // utils提供工具函数，包括生成处理各种样式语言的loader，获取资源文件存放路径的工具函数。
const utils = require('./utils')
const webpack = require('webpack')
    // 默认是index文件,也就是config文件里面的index.js
const config = require('../config')
    // 将基础配置和开发环境配置或者生产环境配置合并在一起的包管理
const merge = require('webpack-merge')
    // 引入基本webpack基本配置
const baseWebpackConfig = require('./webpack.base.conf')
    // 在webpack中拷贝文件和文件夹
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
    //一个用来压缩优化CSS大小的东西
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
    // 一个用来压缩优化JS大小的东西
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
    // 引入生产环境
const env = process.env.NODE_ENV === 'testing' ?
    require('../config/test.env') :
    require('../config/prod.env')
    // 将webpack基本配置和生产环境配置合并在一起，生成css,postcss,less等规则，并进行模块转换，转换成webpack可识别的文件，进行解析
const webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap, //是否使用sourcemap
            extract: true, //将CSS提取到单独文件中去
            usePostCSS: true //是否使用postcss
        })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
        path: config.build.assetsRoot, //// 文件打包的输出路径
        filename: utils.assetsPath('js/[name].[chunkhash].js'), //主文件入口文件名字
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js') //非主文件入口文件名
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        //DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。
        new webpack.DefinePlugin({
            'process.env': env
        }),
        // 用来压缩优化JS大小的东西
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            sourceMap: config.build.productionSourceMap,
            parallel: true
        }),
        // extract css into its own file
        // 它会将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            // Setting the following option to `false` will not extract CSS from codesplit chunks.
            // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
            // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
            // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
            allChunks: true,
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        //一个用来压缩优化CSS大小的东西
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.build.productionSourceMap ? { safe: true, map: { inline: false } } : { safe: true }
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: process.env.NODE_ENV === 'testing' ?
                'index.html' : config.build.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true, //删除index.html中的注释
                collapseWhitespace: true, // 删除index.html中的空格
                removeAttributeQuotes: true // 删除各种html标签属性值的双引号
                    // more options:
                    // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency' // 注入依赖的时候按照依赖先后顺序进行注入，比如，需要先注入vendor.js，再注入app.js
        }),
        // keep module.id stable when vendor modules does not change
        // 该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境。
        new webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting
        //预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度。
        new webpack.optimize.ModuleConcatenationPlugin(),
        // split vendor js into its own file
        // 将所有从node_modules中引入的js提取到vendor.js，即抽取库文件
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks(module) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        //把webpack的runtime和manifest这些webpack管理所有模块交互的代码打包到[name].js文件中,防止build之后vendor的hash值被更新
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
        }),
        // This instance extracts shared chunks from code splitted chunks and bundles them
        // in a separate chunk, similar to the vendor chunk
        // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
        new webpack.optimize.CommonsChunkPlugin({
            name: 'app',
            async: 'vendor-async',
            children: true,
            minChunks: 3
        }),

        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.build.assetsSubDirectory,
            ignore: ['.*']
        }])
    ]
})

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig