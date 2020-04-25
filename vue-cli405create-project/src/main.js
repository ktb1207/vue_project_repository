import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import ElementUI, {Message} from 'element-ui';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'element-ui/lib/theme-chalk/index.css';
import 'swiper/dist/css/swiper.css';
import './registerServiceWorker';
import './assets/reset.css';
import './assets/style.less';

import api from '@/api/index';
import utils from '@/utils/utils';
// axios.defaults.headers.common["Authorization"] = "Bearer cn-93d8b935-057a-4ec4-a882-829fc24b6e64";
// 请求拦截
axios.interceptors.request.use (
  config => {
    if (config.method === 'post') {
      if (config.headers['Content-Type'] === 'application/json') {
        config.data = {
          ...config.data,
          _t: Date.parse (new Date ()) / 1000,
        };
      } else if (
        config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
      ) {
        config.data = `${config.data}&_t=${Date.parse (new Date ()) / 1000}`;
      }
    } else if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.parse (new Date ()) / 1000,
      };
    } else if (config.method === 'delete') {
      config.params = {
        _t: Date.parse (new Date ()) / 1000,
        ...config.params,
      };
    }
    return config;
  },
  error => {
    return Promise.reject (error);
  }
);
// 响应拦截
axios.interceptors.response.use (
  response => {
    if (response.status === 200) {
      return response;
    }
    failMessage ();
  },
  error => {
    if (error && error.response) {
      let msg = '';
      switch (error.response.status) {
        case 404:
          msg = '请求地址出错';
          break;
        case 408:
          msg = '请求超时';
          break;
        case 500:
          msg = '服务器内部错误';
          break;
        case 502:
          msg = '服务器内部错误';
          break;
        default:
          msg = '';
          break;
      }
      failMessage (msg);
    }
    return Promise.reject (error);
  }
);
Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.prototype.$get = axios.get;
Vue.prototype.$post = axios.post;
Vue.prototype.$delete = axios.delete;
Vue.prototype.$utils = utils;
Vue.use (ElementUI);
Vue.use (VueAxios, axios);
Vue.use (VueAwesomeSwiper);
Vue.config.productionTip = false;

new Vue ({
  router, // 注router
  store, // 注入store
  render: h => h (App),
}).$mount ('#app');

function failMessage (mes = '服务器异常') {
  Message ({
    showClose: false,
    message: mes,
    type: 'error',
    duration: 2000,
  });
}
