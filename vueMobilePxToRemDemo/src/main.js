// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require('./css/style.less')
    //require('./css/style.css')
import Vue from 'vue'
import Vuex from 'vuex'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import router from './router'
import store from './store'
import 'babel-polyfill'
//import 'lib-flexible/flexible'
import './utils/pxToRem.js';
Vue.use(Vuex);
Vue.use(Mint)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})