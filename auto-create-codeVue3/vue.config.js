// 端口号
const theDefaultPort = 8086;
// 环境
function isDevelopment() {
  return process.env.NODE_ENV === 'development' ? true : false;
}

module.exports = {
  // 部署应用包时的基本 URL
  publicPath: isDevelopment() ? '/' : './',
  // 生成的生产环境构建文件的目录
  outputDir: './dist',
  // 是否为生产环境构建生成 source map
  productionSourceMap: false,
  pages: {
    index: {
      entry: './src/main.ts',
      template: './public/index.html',
      filename: 'index.html',
      title: 'vue代码生成器'
    }
  },
  configureWebpack: () => {
    const configObj = {
      resolve: {
        extensions: ['.js', '.ts', '.vue', '.tsx', '.jsx'],
        modules: ['node_modules']
      }
    };
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      configObj.output = {
        pathinfo: false
      };
    } else {
      // 为开发环境修改配置...
      configObj.cache = {
        type: 'filesystem',
        allowCollectingMemory: true
      };
    }
    return configObj;
  },
  devServer: {
    open: true,
    // 打开页面
    openPage: 'index.html#/',
    port: theDefaultPort,
    https: false,
    hotOnly: false,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        secure: false,
        changeOrigin: true
      }
    }
  }
};
