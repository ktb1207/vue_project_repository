/* eslint-disable nuxt/no-cjs-in-config */
const path = require('path')
const env = require('./env')
export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  /**
   * build 目录
   * 为 Nuxt.js 应用程序定义.nuxt(默认)目录
   * 默认: .nuxt
   * 默认情况下，默认.nuxt是一个隐藏目录，因为它的名字以.开头。
   * */
  // buildDir: 'dist',
  // 服务端变量映射到客户端
  env: {
    MODE: process.env.MODE,
  },
  // 设置项目启动的端口和ip
  server: env[process.env.MODE].server,
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '自定义标题',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, user-scalable=no',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      {
        name: 'keywords',
        content: 'vue, ssr, vuessr',
      },
      {
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=edge, chrome=1',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    path.join(__dirname, '/assets/styles/reset.css'),
    path.join(__dirname, '/assets/styles/style.less'),
  ],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   ** mode 属性
   ** 不写mode属性, 表示前端客户端和前端服务端都生效
   ** mode: 'client'   表示是仅在前端客户端生效
   ** mode: 'server'   表示是仅在前端服务端生效
   */
  plugins: [
    '@/plugins/element-ui',
    { src: path.join(__dirname, '/plugins/axiosConfig.js') },
    { src: path.join(__dirname, '/plugins/testPlugin.js') },
    { src: path.join(__dirname, '/plugins/testPlugin2.js'), mode: 'client' },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: env[process.env.MODE].api.host,
    proxy: true,
  },
  proxy: {
    '/hrd-ess-service': {
      target: env[process.env.MODE].api.host,
      secure: false,
      changeOrigin: true,
    },
    '/hrd-userauth-service': {
      target: env[process.env.MODE].api.host,
      secure: false,
      changeOrigin: true,
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    transpile: [/^element-ui/],
  },
  loading: {
    color: 'red',
    height: '6px',
  },
}
