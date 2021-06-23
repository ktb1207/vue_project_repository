import { createRouter, createWebHashHistory } from 'vue-router';
import { routerMap } from './routerMap';

const router = createRouter({
  history: createWebHashHistory(),
  routes: routerMap
});

export default router;
