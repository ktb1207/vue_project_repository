import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    showLoading: true, // loading
    projectId: 0
  },
  mutations: {
    changeLoading(state, status) {
      state.showLoading = status;
    },
    changeProjectId(state, id) {
      state.projectId = id;
    }
  },
  actions: {
    saveLoading(context, status) {
      context.commit('changeLoading', status);
    },
    saveProjectId(context, id) {
      context.commit('changeProjectId', id);
    }
  }
});
