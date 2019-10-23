import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
const routes = [{
        path: '*',
        redirect: '/itemSummary'
    },
    {
        path: '/itemSummary',
        name: 'itemSummary',
        meta: {
            title: 'demo'
        },
        component: (resolve) => require(['../views/itemSummary.vue'], resolve)
    }, {
        path: '/itemDetails',
        name: 'itemDetails',
        meta: {
            title: 'demo'
        },
        component: (resolve) => require(['../views/itemDetails.vue'], resolve)
    }, {
        path: '/activeCost',
        name: 'activeCost',
        meta: {
            title: 'demo'
        },
        component: (resolve) => require(['../views/activeCost.vue'], resolve)
    }, {
        path: '/costVerify',
        name: 'costVerify',
        meta: {
            title: 'demo'
        },
        component: (resolve) => require(['../views/costVerify.vue'], resolve)
    }, {
        path: '/monthPlan',
        name: 'monthPlan',
        meta: {
            title: 'demo'
        },
        component: (resolve) => require(['../views/monthPlan.vue'], resolve)
    }
];
const RouterConfig = {
    mode: 'history',
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