import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
const routes = [{
        path: '*',
        redirect: '/pageOne'
    },
    {
        path: '/pageOne',
        name: 'pageOne',
        meta: {
            title: '页面1',
            index: 1
        },
        component: (resolve) => require(['../views/pageOne.vue'], resolve)
    }, {
        path: '/pageTwo',
        name: 'pageTwo',
        meta: {
            title: '页面2',
            index: 2
        },
        component: (resolve) => require(['../views/pageTwo.vue'], resolve)
    }, {
        path: '/pageThree',
        name: 'pageThree',
        meta: {
            title: '页面3',
            index: 3
        },
        component: (resolve) => require(['../views/pageThree.vue'], resolve)
    }, {
        path: '/pageFour',
        name: 'pageFour',
        meta: {
            title: '页面4',
            index: 4
        },
        component: (resolve) => require(['../views/pageFour.vue'], resolve)
    }, {
        path: '/pageFive',
        name: 'pageFive',
        meta: {
            title: '页面5',
            index: 5
        },
        component: (resolve) => require(['../views/pageFive.vue'], resolve)
    }, {
        path: '/pageSix',
        name: 'pageSix',
        meta: {
            title: '页面6',
            index: 6
        },
        component: (resolve) => require(['../views/pageSix.vue'], resolve)
    },{
        path: '/pageSeven',
        name: 'pageSeven',
        meta: {
            title: '页面7',
            index: 7
        },
        component: (resolve) => require(['../views/pageSeven.vue'], resolve)
    },
    {
        path: '/pageEight',
        name: 'pageEight',
        meta: {
            title: '页面8',
            index: 7
        },
        component: (resolve) => require(['../views/pageEight.vue'], resolve)
    },
    {
        path: '/pageNine',
        name: 'pageNine',
        meta: {
            title: '页面9',
            index: 7
        },
        component: (resolve) => require(['../views/pageNine.vue'], resolve)
    }
];
const RouterConfig = {
    mode: 'hash',
    routes: routes
};
const Routers = new VueRouter(RouterConfig);

Routers.beforeEach(function(to, from, next) {
    window.document.title = to.meta.title;
    next();
});
Routers.afterEach(function(to, from, next) {
    window.scrollTo(0, 0);
});

export default Routers;