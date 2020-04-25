import Vue from 'vue';
import Vuex from 'vuex'; // 引入

Vue.use (Vuex); // 安装vuex

export default new Vuex.Store ({
  // 实例化store
  state: {
    showLoading: true, // loading
    projectId: 0,
  },
  mutations: {
    changeLoading (state, status) {
      state.showLoading = status;
    },
    changeProjectId (state, id) {
      state.projectId = id;
    },
  },
  actions: {
    saveLoading (context, status) {
      context.commit ('changeLoading', status);
    },
    saveProjectId (context, id) {
      context.commit ('changeProjectId', id);
    },
  },
});
