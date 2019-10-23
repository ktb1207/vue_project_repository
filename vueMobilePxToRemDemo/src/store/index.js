import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
let stores = new Vuex.Store({
    state: {
        showLoading: true, //页面加载中

    },
    mutations: {
        switchLoading(state, status) {
            state.showLoading = status;
        }
    },
    actions: {
        switchLoading(context, status) {
            context.commit('switchLoading', status);
        }
    }
});

export default stores;