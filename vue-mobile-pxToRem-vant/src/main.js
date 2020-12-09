import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import './registerServiceWorker';
import './utils/pxToRem.js';
import utils from '@/utils/utils';
import api from '@/api/index.js';
import { 
  Button, 
  Toast,
  DatetimePicker
} from 'vant';
import Popop from './components/popup/index.js';
import Loading from './components/popopLoading/index.js';
import Message from './components/message/index.js';
import 'vant/lib/index.css';
import './styles/reset.css';
import './styles/style.less';
import './styles/reset-vant.less';
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
Vue.prototype.$Loading = Loading;
Vue.config.productionTip = false;
Vue.use (VueAxios, axios);
// vant 批量注册
const vantComponent = [Button,Toast,DatetimePicker];
vantComponent.forEach(item => {
  Vue.use(item);
});
Vue.use(Popop);
Vue.use(Message);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
console.log(process.env.VUE_APP_BASE_URL);
console.log(process.env.NODE_ENV);
console.log(window.devicePixelRatio);
function failMessage (mes = '服务器异常') {
  Toast({
    message: mes,
    forbidClick: true,
    type: 'fail',
  });
}

