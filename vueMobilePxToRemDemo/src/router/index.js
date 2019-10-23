import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { MessageBox } from 'mint-ui';
import { Toast } from 'mint-ui';
Vue.use(VueRouter);
const routes = [{
        path: '*',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            title: '首页',
            index: 0
        },
        component: (resolve) => require(['../views/home.vue'], resolve)
    }, {
        path: '/find',
        name: 'find',
        meta: {
            title: '发现',
            index: 1
        },
        component: (resolve) => require(['../views/find.vue'], resolve)
    }, {
        path: '/save',
        name: 'save',
        meta: {
            title: '收藏',
            index: 2
        },
        component: (resolve) => require(['../views/save.vue'], resolve)
    }, {
        path: '/my',
        name: 'my',
        meta: {
            title: '我的',
            index: 3
        },
        component: (resolve) => require(['../views/my.vue'], resolve)
    }
];
const RouterConfig = {
    mode: 'hash',
    routes: routes
};
const Routers = new VueRouter(RouterConfig);

Routers.beforeEach(function(to, from, next) {
    window.document.title = to.meta.title;
    //导航拦截，判断是否登录
    if (to.name == 'my') {
        MessageBox({
            title: '提示',
            message: '您尚未登录,请先登录',
            showCancelButton: true,
            confirmButtonText: '登录'
        }).then(action => {
            Toast({
                message: '登录失败',
                position: 'bottom',
                duration: 1200
            })
            next('/home');
        })
    } else {
        next();
        //切换页面显示加载中
        store.dispatch('switchLoading', true)
    }


});
Routers.afterEach(function(to, from, next) {
    window.scrollTo(0, 0);
});

export default Routers;