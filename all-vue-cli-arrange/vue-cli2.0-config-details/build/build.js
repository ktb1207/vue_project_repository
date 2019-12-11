'use strict'
// 进行npm和node版本检查
require('./check-versions')()
    // 当前node的环境变量设置为production
process.env.NODE_ENV = 'production'
    // npm run build显示的进度条
const ora = require('ora')
    // 用于删除文件或者文件夹的插件,
const rm = require('rimraf')
    // node.js的文件路径，用来处理文件当中的路径问题
const path = require('path')
    //  chalk插件，他的作用是在控制台中输出不同的颜色的字，大致这样用chalk.blue('Hello world')，这款插件只能改变命令行中的字体颜色
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
    // 引入webpack生产环境配置
const webpackConfig = require('./webpack.prod.conf')
    // 填写打包时所显示的提示信息
const spinner = ora('building for production...')
    // 开启loading动画
spinner.start()
    // node.js将文件目录拼接起来，默认是/dist/static
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpackConfig, (err, stats) => {
        spinner.stop()
        if (err) throw err
            // process.stdout.write这一串是控制打包后详细文件的输出情况
        process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
                chunks: false,
                chunkModules: false
            }) + '\n\n')
            //  打包失败，显示错误信息，并退出程序
        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }
        // 打包成功在控制台上显示打包成功提示信息
        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
})