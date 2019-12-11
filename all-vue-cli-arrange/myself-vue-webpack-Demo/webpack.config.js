/**
 * Created by ktb on 17-12-16.
 */
/*
* 注释：__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
* */

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry:{
        index:path.resolve(__dirname,"app/js/ctrl/index.js"),
        login:path.resolve(__dirname,"app/js/ctrl/login.js")
    },
    output: {
        path:path.resolve(__dirname,"public/"),
        filename: "[name].js",
        //publicPath: 'http://192.168.7.181:8080/public/',
    },
    resolve: {
        extensions: ['*', '.js', '.vue'],
        alias:{
            'vue':'vue/dist/vue.js',
            'vue-router':'vue-router/dist/vue-router.js'
        }
    },
    module: {
        rules: [
            {
                test:/\.js$/,
                loader:'babel-loader',
                query:{
                    presets:["latest"]
                },
                include:[path.resolve(__dirname, "app/js")],
                exclude:[path.resolve(__dirname,"node_modules/")]
            },
            {
                test:/\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use:'css-loader',
                }),
                include:[path.resolve(__dirname, "app/css")],
                exclude:[path.resolve(__dirname,"node_modules/")]
            },
            {
                test:/\.(png|jpg|gif)$/i,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:10000,
                        name:'[name].[hash].[ext]',
                        outputPath:'images/'
                    }
                }]
            },
            {
                test:/\.html$/i,
                use:['html-loader']
            },
            {
                test:/\.vue$/,
                use:['vue-loader'],
                include:[path.resolve(__dirname, "app/components")],
                exclude:[path.resolve(__dirname,"node_modules/")]
            }
        ]
    },
    devServer: {
        contentBase:'./public/',
        historyApiFallback:true,
        inline:true,
        //hot:true,
        //host:'192.168.10.181',              //指定ip，必须与本机一致，不然报错
        //port:'8080',                        //指定端口号
        openPage:'login.html',              //默认打开页面
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    },
    plugins:[
        new HtmlWebpackPlugin({
            title:'App Style Title',        //生成的html模板title,如果模板中有设置title的名字，则会忽略这里的设置
            template:'./app/index.html',    //模板来源文件
            filename:'index.html',          //生成的模板文件的名字
            showErrors:true,                //是否将错误信息写在页面里，默认true，出现错误信息则会包裹在一个pre标签内添加到页面上
            inject:'body',                  //引入模块的注入位置；取值有true/false/body/head
            favicon:'',                     //指定页面图标；
            hash:true,                      //是否生成hash添加在引入文件地址的末尾，类似于我们常用的时间戳
            cache:'',                       //是否需要缓存，如果填写true，则文件只有在改变时才会重新生成
            chunks:['index'],                 //引入的模块,如果不设置则默认全部引入
            minify: {
                caseSensitive: false,       //是否大小写敏感
                collapseBooleanAttributes: true,//是否简写boolean格式的属性如：disabled="disabled" 简写为disabled
                collapseWhitespace:false    //是否去除空格
            }
        }),
        new HtmlWebpackPlugin({
            title:'App Style Title',        //生成的html模板title,如果模板中有设置title的名字，则会忽略这里的设置
            template:'./app/login.html',    //模板来源文件
            filename:'login.html',          //生成的模板文件的名字
            showErrors:true,                //是否将错误信息写在页面里，默认true，出现错误信息则会包裹在一个pre标签内添加到页面上
            inject:'head',                  //引入模块的注入位置；取值有true/false/body/head
            favicon:'',                     //指定页面图标；
            hash:true,                      //是否生成hash添加在引入文件地址的末尾，类似于我们常用的时间戳
            cache:'',                       //是否需要缓存，如果填写true，则文件只有在改变时才会重新生成
            chunks:['login'],                 //引入的模块,如果不设置则默认全部引入
            minify: {
                caseSensitive: false,       //是否大小写敏感
                collapseBooleanAttributes: true,//是否简写boolean格式的属性如：disabled="disabled" 简写为disabled
                collapseWhitespace:false    //是否去除空格
            }
        }),
        new ExtractTextPlugin({
            filename: '[name].css'
        })
    ]

}