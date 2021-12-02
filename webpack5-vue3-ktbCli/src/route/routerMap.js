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
    path: '/canvas',
    name: 'Canvas',
    component: () => import('@/page/Canvas.vue')
  },
  {
    path: '/jsErrorAnalyse',
    name: 'JSErrorAnalyse',
    component: () => import('@/page/JSErrorAnalyse.vue')
  },
  {
    path: '/echartsMap',
    name: 'EchartsMap',
    component: () => import('@/page/EchartsMap.vue')
  },
  {
    path: '/arraySort',
    name: 'ArraySort',
    component: () => import('@/page/ArraySort.vue')
  },
  {
    path: '/promiseAsync',
    name: 'PromiseAsync',
    component: () => import('@/page/PromiseAsync.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/page/About.vue')
  }
];
