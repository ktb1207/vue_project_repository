import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/:projectId/nameRouterPage',
      name: 'nameRouterPage',
      component: () => import('./views/NameRouterPage.vue')
    },
    {
      path: '/paramsPage',
      name: 'paramsPage',
      component: () => import('./views/ParamsPage.vue')
    },
    {
      path: '/queryPage',
      name: 'queryPage',
      component: () => import('./views/QueryPage.vue')
    },
    {
      path: '/:projectId/aboutRoute',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/error404',
      name: 'error',
      component: () => import('./views/Error404.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    next('/error404');
  } else {
    next(); // 如果匹配到正确跳转
  }
});
export default router;
