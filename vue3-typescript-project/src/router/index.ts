import { createRouter, createWebHistory, RouteRecordRaw, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    component: Home
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/happyYear',
    name: 'HappyYear',
    component: () => import('@/views/happyYear/HappyYear.vue')
  },
  {
    path: '/coordinate',
    name: 'Coordinate',
    component: () => import('@/views/Coordinate.vue')
  },
  {
    path: '/kTable',
    name: 'KTable',
    component: () => import('@/views/KTable.vue')
  },
  {
    path: '/hfunction',
    name: 'HFunction',
    component: () => import('@/views/HFunction')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;
