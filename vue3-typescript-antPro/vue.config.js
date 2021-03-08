/**
 * vue config
 * */

function isDevelopment() {
  return process.env.NODE_ENV === 'development' ? true : false;
}
//启动项目时自动打开浏览器的插件
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
//打包前自动清空dist目录的插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//端口号
const theDefaultPort = 8089;
const theDefaultRouter = '/';
module.exports = {
  // 部署应用包时的基本 URL
  publicPath: isDevelopment() ? '/' : './',
  // 生成的生产环境构建文件的目录
  outputDir: './dist',
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: true,
  // 是否为生产环境构建生成 source map？
  productionSourceMap: false,
  // 向 PWA 插件传递选项。
  pwa: {},
  // 三方插件的选项
  pluginOptions: {
    // ...
  },
  // 允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: (config) => {
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .loader('eslint-loader')
      .tap((options) => {
        options.fix = true;
        return options;
      });
  },
  //
  configureWebpack: () => {
    if (process.env.NODE_ENV !== 'development') {
      // 为生产环境修改配置...
      return {
        plugins: [new CleanWebpackPlugin()]
      };
    } else {
      // 为开发环境修改配置...
      return {
        plugins: [
          new OpenBrowserPlugin({
            url: 'http://localhost:' + theDefaultPort + '/index.html#' + theDefaultRouter
          })
        ]
      };
    }
  },
  // css
  css: {
    // 默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。
    // 设置为 false 后你就可以去掉文件名中的 .module 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。
    // default: true
    requireModuleExtension: true,
    // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
    // Default: 生产环境下是 true，开发环境下是 false
    extract: isDevelopment() ? false : true,
    // 是否为 CSS 开启 source map
    // Default: false
    sourceMap: false,
    // 向 CSS 相关的 loader 传递选项(支持 css-loader postcss-loader sass-loader less-loader stylus-loader)
    loaderOptions: {
      // 这里的选项会传递给 css-loader
      // css: {},
      // 这里的选项会传递给 postcss-loader
      // postcss: {}
    }
  },
  // 配置 webpack-dev-server 行为。
  devServer: {
    open: false,
    host: '0.0.0.0',
    port: theDefaultPort,
    https: false,
    hotOnly: false,
    hot: true,
    // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#配置代理
    proxy: {
      '/api': {
        target: 'http://11.0.35.133:8091/', // wang
        // target: 'http://10.30.204.149:10001/',
        secure: false, // if you want to verify the SSL Certs,如果是https接口，需要配置这个参数
        changeOrigin: true, // 默认false，是否需要改变原始主机头为目标URL。如果接口跨域，需要进行这个参数配置
        // headers: {
        //   Authorization: `Bearer ${loginToken}`,
        // },
        pathRewrite: {
          '^/api': ''
        }
      }
    }, // string | Object
    overlay: {
      warnings: false, // 警告浏览器不显示
      errors: true // 错误提示浏览器显示错误
    },
    before: () => {}
  }
};
