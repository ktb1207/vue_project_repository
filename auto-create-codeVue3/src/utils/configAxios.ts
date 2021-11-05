import axios from 'axios';
import { utils } from './index';
const baseUrl = '';

const httpAxios = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  withCredentials: true
});

// 请求拦截
httpAxios.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = 'admin login';
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: new Date().getTime()
      };
    }
    if (config.method === 'post') {
      if (config.headers['Content-Type'] === 'application/json') {
        console.log(config.data);
      } else if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        console.log(config.data);
      } else {
        console.log(config.data);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
httpAxios.interceptors.response.use(
  (res) => {
    if (res.data.code !== 200) {
      utils.showErrorMessage(res.data.msg + '');
    }
    if (res.status === 200) {
      return res.data;
    }
  },
  (error) => {
    if (error && error.response) {
      let msg = '请求出错';
      switch (Number(error.response.status)) {
        case 400:
          msg = error.response.data.msg;
          break;
        case 404:
          msg = '请求地址出错';
          break;
        case 500:
          msg = '服务器内部错误';
          break;
        case 502:
          msg = '服务器内部错误';
          break;
        case 504:
          msg = '请求超时';
          break;
        default:
          break;
      }
      utils.showErrorMessage(msg);
    }
    // if (error.message) {
    //   utils.showErrorMessage(error.message);
    // }
    return Promise.reject(error);
  }
);
export { httpAxios };
