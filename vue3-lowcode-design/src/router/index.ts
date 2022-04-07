import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/design',
    name: 'Design',
    component: () => import('@/pages/DesignPage/index'),
    meta: {
      title: '设计中心'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '@/pages/AboutPage.vue'),
    meta: {
      title: '关于'
    }
  },
  {
    path: '/codemirror',
    name: 'Codemirror',
    component: () => import(/* webpackChunkName: "about" */ '@/pages/CodeMirror.vue'),
    meta: {
      title: '关于'
    }
  },
  {
    path: '/notFound',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
    meta: {
      title: '404 page'
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next): void => {
  if (to.matched.length === 0) {
    // 路由不存在
    next('/notFound');
  } else {
    next();
  }
});

export default router;
