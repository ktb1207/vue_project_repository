//启动项目时自动打开浏览器的插件
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
//打包前自动清空dist目录的插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//端口号
const theDefaultPort = 8089;
const theDefaultRouter = '/home';
//登录状态
const loginToken = 'cn-2708c8fa-3e4a-4a12-ba26-e5d875dc7986';
module.exports = {
  // 项目部署的基础路径
  // 我们默认假设你的应用将会部署在域名的根部，
  // 比如 https://www.my-app.com/
  // 如果你的应用时部署在一个子路径下，那么你需要在这里
  // 指定子路径。比如，如果你的应用部署在
  // https://www.foobar.com/my-app/
  // 那么将这个值改为 `/my-app/`
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
  // 将构建好的文件输出到哪里
  outputDir: './dist', // 打包文件名自行修改
  // 使用带有浏览器内编译器的完整构建版本
  // 查阅 https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时
  // compiler: false,

  // 调整内部的 webpack 配置。
  // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/webpack.md
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
  configureWebpack: (config) => {
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
            url: 'http://localhost:' + theDefaultPort + theDefaultRouter
          })
        ]
      };
    }
  },
  // vue-loader 选项
  // 查阅 https://vue-loader.vuejs.org/zh-cn/options.html
  // vueLoader: {},
  // 是否使用包含运行时编译器的Vue核心的构建
  runtimeCompiler: true,
  // 是否为生产环境构建生成 source map？
  productionSourceMap: false,

  // CSS 相关选项
  css: {
    // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中,当作为一个库构建时，你也可以将其设置为 false 免得用户自己导入 CSS
    // 默认生产环境下是 true，开发环境下是 false
    extract: process.env.NODE_ENV === 'development' ? false : true,
    // 是否开启 CSS source map？
    // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能
    sourceMap: false,

    //向 CSS 相关的 loader 传递选项(支持 css-loader postcss-loader sass-loader less-loader stylus-loader)
    //如{css:{},less:{},sass:{}}
    loaderOptions: {},

    // 项目package.json查看@vue/cli-service版本号进行配置
    // v3用modules v4用requireModuleExtension
    // modules:false,
    // 默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。
    // 设置为 false 后你就可以去掉文件名中的 .module 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。
    requireModuleExtension: true
  },

  // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
  // 在多核机器下会默认开启。
  parallel: require('os').cpus().length > 1,

  // 是否使用 `autoDLLPlugin` 分割供应的包？
  // 也可以是一个在 DLL 包中引入的依赖的显性的数组。
  // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#dll-模式
  // dll: false,

  // PWA 插件的选项。
  // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli-plugin-pwa/README.md
  pwa: {},

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
  },

  // 三方插件的选项
  pluginOptions: {
    // ...
  },
  // Type: boolean | 'warning' | 'default' | 'error'
  // Default: 'default'
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  // 设置为 true 或 'warning' 时，eslint-loader 会将 lint 错误输出为编译警告。默认情况下，警告仅仅会被输出到命令行，且不会使得编译失败。
  // 如果你希望让 lint 错误在开发时直接显示在浏览器中，你可以使用 lintOnSave: 'default'。这会强制 eslint-loader 将 lint 错误输出为编译错误，同时也意味着 lint 错误将会导致编译失败。
  // 设置为 error 将会使得 eslint-loader 把 lint 警告也输出为编译错误，这意味着 lint 警告将会导致编译失败。
  lintOnSave: 'warning'
  // 是否在开发环境下通过 eslint-loader
  // lintOnSave: process.env.NODE_ENV !== 'production'
};
