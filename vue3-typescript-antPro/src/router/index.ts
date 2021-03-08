import { createRouter, createWebHashHistory, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { routerMap } from './routerMap';
import util from '@/utils/index';
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes: routerMap
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void => {
  const loginTag: string | null = util.getToken();
  console.log(to);
  if (to.matched.length === 0) {
    // 路由不存在
    next('/notFound');
  } else if (to.meta.requireLogin && (loginTag === '' || loginTag === null)) {
    // 无路由权限
    next('/login');
  } else if (loginTag && to.path === '/login') {
    // 登录状态重定向首页
    next('/');
  } else {
    next();
  }
});

export default router;
