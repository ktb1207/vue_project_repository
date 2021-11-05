import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import editorRouter from '@/admin/route/editorRouter';
import previewRouter from './previewRouter';
const commonRouter: Array<RouteRecordRaw> = [
  {
    path: '/error',
    name: 'Error',
    component: () => import('../pages/Error.vue'),
    meta: {
      title: 'error 404'
    }
  }
];
const routes: Array<RouteRecordRaw> =
  process.env.NODE_ENV === 'development'
    ? [...editorRouter, ...previewRouter, ...commonRouter]
    : [...previewRouter, ...commonRouter];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next): void => {
  if (to.matched.length === 0) {
    // 路由不存在
    next('/error');
  } else {
    next();
  }
});
export default router;
