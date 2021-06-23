export const routerMap = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/page/Home.vue')
  },
  {
    path: '/proxy',
    name: 'Proxy',
    component: () => import('@/page/Proxy.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/page/About.vue')
  }
];
