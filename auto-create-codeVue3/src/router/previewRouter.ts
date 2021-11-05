import { RouteRecordRaw } from 'vue-router';
import autoCreateRouter from './autoCreateRouter.json';
const autoCreateRouterArr = autoCreateRouter.routerArr as Array<any>;
// 自动创建页面路由
const addAutoRouter = autoCreateRouterArr.map((item) => {
  return {
    ...item,
    component: () => import(`../autoCreatePage/${item.name}.vue`)
  };
});

const previewRouter: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/pages/Test.vue'),
    meta: {
      title: '测试'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '@/pages/About.vue'),
    meta: {
      title: '关于'
    }
  },
  ...addAutoRouter
];

export default previewRouter;
