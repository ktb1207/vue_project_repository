import { RouteRecordRaw } from 'vue-router';

export const routerMap: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      requireLogin: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: '关于',
      requireLogin: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录',
      requireLogin: false
    }
  },
  {
    path: '/notFound',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '404',
      requireLogin: false
    }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('../views/Forbid.vue'),
    meta: {
      title: '403',
      requireLogin: false
    }
  }
];
