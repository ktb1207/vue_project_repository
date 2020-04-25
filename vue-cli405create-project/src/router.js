import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use (Router);

const router = new Router ({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/:projectId/nameRouterPage',
      name: 'nameRouterPage',
      component: () => import ('./views/NameRouterPage.vue'),
    },
    {
      path: '/paramsPage',
      name: 'paramsPage',
      component: () => import ('./views/ParamsPage.vue'),
    },
    {
      path: '/queryPage',
      name: 'queryPage',
      component: () => import ('./views/QueryPage.vue'),
    },
    {
      path: '/treeTable',
      name: 'treeTable',
      component: () => import ('./views/TreeTable.vue'),
    },
    {
      path: '/virtualScroll',
      name: 'virtualScroll',
      component: () => import ('./views/VirtualScroll.vue'),
    },
    {
      path: '/swiperPage',
      name: 'swiperPage',
      component: () => import ('./views/SwiperStudy.vue'),
    },
    {
      path: '/boxShadow',
      name: 'boxShadow',
      component: () => import ('./views/BoxShadow.vue'),
    },
    {
      path: '/transformTwo',
      name: 'transformTwo',
      component: () => import ('./views/TransformTwo.vue'),
    },
    {
      path: '/string',
      name: 'string',
      component: () => import ('./views/JsString.vue'),
    },
    {
      path: '/array',
      name: 'array',
      component: () => import ('./views/JsArray.vue'),
    },
    {
      path: '/number',
      name: 'number',
      component: () => import ('./views/JsNumber.vue'),
    },
    {
      path: '/computedMethod',
      name: 'computedMethod',
      component: () => import ('./views/ComputedMethod.vue'),
    },
    {
      path: '/aboutVue',
      name: 'aboutVue',
      component: () => import ('./views/AboutVue.vue'),
    },
    {
      path: '/sourceCode',
      name: 'sourceCode',
      component: () => import ('./views/VueSourceCode.vue'),
    },
    {
      path: '/webpack',
      name: 'webpack',
      component: () => import ('./views/Webpack.vue'),
    },
    {
      path: '/uploadFile',
      name: 'uploadFile',
      component: () => import ('./views/UploadFile.vue'),
    },
    {
      path: '/:projectId/aboutRoute',
      name: 'about',
      component: () => import ('./views/About.vue'),
    },
    {
      path: '/error404',
      name: 'error',
      component: () => import ('./views/Error404.vue'),
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    if (savedPosition) {
      return savedPosition;
    }
    return {x: 0, y: 0};
  },
});

router.beforeEach ((to, from, next) => {
  if (to.matched.length === 0) {
    next ('/error404');
  } else {
    next (); // 如果匹配到正确跳转
  }
});
export default router;
