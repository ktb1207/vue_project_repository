import Vue from 'vue';
import App from './App.vue';
import {sync} from 'vuex-router-sync';

const createRouter = require('./router/index.js');
const createStore = require('./store/store.js');

Vue.config.productionTip = false;

export default function createApp () {
  // 创建router实例
  const router = createRouter();
  // 创建vuex实例
  const store = createStore();
  // 同步路由状态(route,state)到store
  sync(store,router);

  // 创建vue实例
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });

  return {app,router,store}
}
