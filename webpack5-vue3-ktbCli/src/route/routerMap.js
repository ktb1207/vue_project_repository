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
    path: '/mountSequence',
    name: 'MountSequence',
    component: () => import('@/page/MountSequence.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/page/About.vue')
  }
];
