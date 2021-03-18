import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

export interface State {
  /*页面权限*/
  limitPage: Array<string>;
  loadingStatus: boolean;
  loadingDom: string;
}

export const mainStorekey: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    limitPage: ['A', 'B', 'C'],
    loadingStatus: false,
    loadingDom: 'body'
  },
  mutations: {
    handleShowLoading(state: State, dom) {
      state.loadingStatus = true;
      state.loadingDom = dom;
    },
    handelHideLoading(state: State) {
      state.loadingStatus = false;
    }
  },
  actions: {
    showLoading(context, dom = 'body') {
      context.commit('handleShowLoading', dom);
    },
    hideLoading(context) {
      context.commit('handelHideLoading');
    }
  },
  modules: {}
});
