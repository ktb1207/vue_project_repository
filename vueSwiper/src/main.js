// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require('./css/style.css');
require('./css/changeElement.css');
import Vue from 'vue';
import 'babel-polyfill';
import ES6Promise from 'es6-promise';
import ElementUI from 'element-ui';
import { Message } from 'element-ui';
import Swiper from 'swiper';
import 'element-ui/lib/theme-default/index.css';
import 'font-awesome/css/font-awesome.css';
import 'swiper/dist/css/swiper.css';
import Animate from 'animate.css';
import echarts from 'echarts';
import router from './router'
import App from './App'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import VueClipboard from 'vue-clipboard2'
import VueHtml2Canvas from 'vue-html2canvas'
Vue.use(ElementUI);
Vue.use(Animate);
Vue.use(VueAxios, Axios);
Vue.use(VueClipboard);
Vue.use(VueHtml2Canvas);
Vue.prototype.$Swiper = Swiper;
Vue.prototype.$Echarts = echarts;
Vue.prototype.$get = Axios.get;
Vue.prototype.$post = Axios.post;
ES6Promise.polyfill();
Vue.config.productionTip = false

//Axios.defaults.headers.common['Authorization'] = "Bearer 159f8dfe-434a-484a-bddd-da61f3de5f80";//张波
//请求拦截
Axios.interceptors.request.use(
        config => {
            if (config.method == 'post') {
                config.data = {
                    ...config.data,
                    _t: Date.parse(new Date()) / 1000,
                }
            } else if (config.method == 'get') {
                config.params = {
                    _t: Date.parse(new Date()) / 1000,
                    ...config.params
                }
            } else if (config.method == 'delete') {
                config.params = {
                    _t: Date.parse(new Date()) / 1000,
                    ...config.params
                }
            }
            return config
        },
        function(error) {
            return Promise.reject(error)
        }
    )
    //响应拦截
Axios.interceptors.response.use(
    response => {
        if (response.status == 200) {
            // if (response.data.code == 0 || response.data.code == 200) {
            //     return response;
            // } else {
            //     failMessage(response.data.message);
            // }
            return response;
        } else {
            failMessage()
        }
    },
    error => {
        if (error && error.response) {
            let msg = '';
            switch (error.response.status) {
                case 404:
                    msg = '请求地址出错'
                    break

                case 408:
                    msg = '请求超时'
                    break

                case 500:
                    msg = '服务器内部错误'
                    break
                default:
                    msg = ""
                    break;
            }
            failMessage(msg);
        }
        return Promise.reject(error)
    }
)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})

function failMessage(mes = '数据获取失败') {
    Message({
        showClose: true,
        message: mes,
        type: 'warning'
    })
}