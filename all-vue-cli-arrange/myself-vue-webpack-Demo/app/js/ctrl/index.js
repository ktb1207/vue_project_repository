require('../../css/basicStyle.css');
require('../../css/index.css');
import Vue from 'vue';
import VueRouter from 'vue-router';
import tabbar from '../../components/tabBar.vue';
Vue.use(VueRouter);


Vue.config.debug = true;
var session = sessionStorage.getItem("login");
if (!session) {
    window.location.href = 'login.html';
}
window.onload = function() {

    const routes = [{
            path: '*',
            redirect: '/image'
        },
        {
            path: '/image',
            meta: {
                title: '图片'
            },
            component: (resolve) => require(['../../components/image.vue'], resolve)
        },
        {
            path: '/music',
            meta: {
                title: '音乐'
            },
            component: (resolve) => require(['../../components/music.vue'], resolve)
        },
        {
            path: '/list',
            meta: {
                title: '排行'
            },
            component: (resolve) => require(['../../components/list.vue'], resolve)
        },
        {
            path: '/down',
            meta: {
                title: '下载量'
            },
            component: (resolve) => require(['../../components/downNum.vue'], resolve)
        }
    ];
    const RouterConfig = {
        mode: 'history',
        routes: routes
    };
    const router = new VueRouter(RouterConfig);
    router.beforeEach(function(to, from, next) {
        window.document.title = to.meta.title;
        next();
    });
    router.afterEach(function(to, from, next) {
        window.scrollTo(0, 0);
    })

    var myApp = new Vue({
        el: '#indexApp',
        data: {
            tittleBar: [{
                tittle: '图片',
                active: true,
                to: 'image'
            }, {
                tittle: '音乐',
                active: false,
                to: 'music'
            }, {
                tittle: '排行',
                active: false,
                to: 'list'
            }, {
                tittle: '下载量',
                active: false,
                to: 'down'
            }]
        },
        methods: {
            handleChange: function(name) {
                this.tittleBar.forEach(function(item) {
                    item.active = (item.tittle === name);
                });
            }
        },
        computed: {

        },
        components: {
            'tab-bar': tabbar
        },
        router: router
    });


}