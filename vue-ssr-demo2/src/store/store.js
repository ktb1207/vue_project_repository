import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

module.exports = function createStore () {
  return new Vuex.Store({
    state: {},
    mutations: {},
    actions: {}
  })
}