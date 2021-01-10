import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('../views/Setup.vue')
  },
  {
    path: '/reactive',
    name: 'Reactive',
    component: () => import('../views/Reacttive.vue')
  },
  {
    path: '/ref',
    name: 'Ref',
    component: () => import('../views/Ref.vue')
  },
  {
    path: '/isReactiveAndRef',
    name: 'IsReactiveAndRef',
    component: () => import('../views/IsReactiveAndIsRef.vue')
  },
  {
    path: '/notRecursion',
    name: 'NotRecursion',
    component: () => import('../views/NotRecursion.vue')
  },
  {
    path: '/toRef',
    name: 'ToRef',
    component: () => import('../views/ToRef.vue')
  },
  {
    path: '/readonly',
    name: 'Readonly',
    component: () => import('../views/Readonly.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
