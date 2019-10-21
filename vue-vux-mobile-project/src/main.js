// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import FastClick from 'fastclick';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/index.js';
import axios from 'axios';
import VueAxios from 'vue-axios';
import api from '@/api/index';
import utils from '@/utils/utils';

FastClick.prototype.onTouchEnd = function(event) {
  // 解决输入框在IOS上获得焦点问题
  if (
    event.target.nodeName === 'INPUT' ||
    event.target.nodeName === 'TEXTAREA'
  ) {
    return false;
  }
};
FastClick.attach(document.body);
// 请求拦截
axios.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      if (config.headers['Content-Type'] === 'application/json') {
        config.data = {
          ...config.data,
          _t: Date.parse(new Date()) / 1000
        };
      } else if (
        config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
      ) {
        config.data = `${config.data}&_t=${Date.parse(new Date()) / 1000}`;
      }
    } else if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.parse(new Date()) / 1000
      };
    } else if (config.method === 'delete') {
      config.params = {
        _t: Date.parse(new Date()) / 1000,
        ...config.params
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// 响应拦截
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response;
    }
  },
  error => {
    return Promise.reject(error);
  }
);
Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.prototype.$get = axios.get;
Vue.prototype.$post = axios.post;
Vue.prototype.$delete = axios.delete;
Vue.prototype.$utils = utils;
Vue.use(VueAxios, axios);
/* eslint-disable no-new */
Vue.config.productionTip = false;
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
