'use strict'
//该文件主要来设置开发环境变量。

// 引入webpack-merge模块
const merge = require('webpack-merge')
    // 引入生产环境配置
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"' // 配置NODE_ENV来决定开发环境
})