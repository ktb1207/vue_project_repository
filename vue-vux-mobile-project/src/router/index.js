import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: {
        title: '首页'
      }
    },
    {
      path: '/drawShare/:projectId/:shareId',
      name: 'drawShare',
      component: () => import('../views/DrawShare.vue'),
      meta: {
        title: '一键提量分项'
      }
    },
    {
      path: '/error404',
      name: 'error',
      component: () => import('../views/Error404.vue'),
      meta: {
        title: '错误页面'
      }
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
  window.document.title = to.meta.title;
  if (to.matched.length === 0) {
    next('/error404');
  } else {
    next(); // 如果匹配到正确跳转
  }
});
export default router;
