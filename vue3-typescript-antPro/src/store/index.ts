import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

export type RouteRecordItemType = {
  labelName: string;
  routeName: string;
};

export interface State {
  /*页面权限*/
  limitPage: Array<string>;
  loadingStatus: boolean;
  loadingDom: string;
  routeRecordData: Array<RouteRecordItemType>;
}

export const mainStorekey: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    // 页面权限
    limitPage: ['A', 'B', 'C'],
    // 加载状态
    loadingStatus: false,
    loadingDom: 'body',
    // 路由记录
    routeRecordData: []
  },
  mutations: {
    handleShowLoading(state: State, dom) {
      state.loadingStatus = true;
      state.loadingDom = dom;
    },
    handelHideLoading(state: State) {
      state.loadingStatus = false;
    },
    handleRouteRecordAdd(state: State, item) {
      state.routeRecordData.push(item);
    },
    handleRouteRecordReduce(state: State, item) {
      // 至少保留一个
      if (state.routeRecordData.length <= 1) {
        return;
      }
      state.routeRecordData.forEach((val, index) => {
        if (item.routeName === val.routeName) {
          state.routeRecordData.splice(index, 1);
        }
      });
    },
    handleRouteRecordClear(state: State) {
      state.routeRecordData = [];
    }
  },
  actions: {
    showLoading(context, dom = 'body') {
      context.commit('handleShowLoading', dom);
    },
    hideLoading(context) {
      context.commit('handelHideLoading');
    },
    addRouteRecord(context, item) {
      context.commit('handleRouteRecordAdd', item);
    },
    reduceRouteRecord(context, item) {
      context.commit('handleRouteRecordReduce', item);
    },
    clearRouteRecord(context) {
      context.commit('handleRouteRecordReduce');
    }
  },
  modules: {}
});
