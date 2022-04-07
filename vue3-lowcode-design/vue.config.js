const { defineConfig } = require('@vue/cli-service');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
const ElementPlus = require('unplugin-element-plus/webpack');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');
const theDefaultPort = 8086;
function isDevelopment() {
  return process.env.NODE_ENV === 'development' ? true : false;
}

module.exports = defineConfig({
  transpileDependencies: false,
  publicPath: isDevelopment() ? '/' : './',
  outputDir: './dist',
  productionSourceMap: false,
  pages: {
    index: {
      entry: './src/main.ts',
      template: './public/index.html',
      filename: 'index.html',
      title: '前端低代码设计器'
    }
  },
  chainWebpack: (config) => {
    config.plugin('monaco-editor').use(MonacoEditorWebpackPlugin, [
      {
        languages: ['html', 'css', 'scss', 'less', 'json', 'javascript', 'typescript'],
        features: ['find', 'format']
      }
    ]);
  },
  configureWebpack: () => {
    const configObj = {
      resolve: {
        extensions: ['.js', '.ts', '.vue', '.tsx', '.jsx'],
        modules: ['node_modules']
      },
      plugins: [
        AutoImport({
          resolvers: [ElementPlusResolver()]
        }),
        Components({
          resolvers: [ElementPlusResolver()]
        }),
        ElementPlus({
          importStyle: 'css',
          useSource: true
        })
      ]
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
    client: {
      overlay: {
        errors: true,
        warnings: false
      },
      progress: true
    },
    open: true,
    host: 'localhost',
    port: theDefaultPort,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        secure: false,
        changeOrigin: true
      }
    }
  }
});
