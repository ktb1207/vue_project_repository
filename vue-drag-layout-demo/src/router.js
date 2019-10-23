import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/:projectId/routerName'
    },
    {
      path: '/:projectId/routerName',
      name: 'routerName',
      component: Home
    },
    {
      path: '/:projectId/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/:projectId/otherName',
      name: 'otherName',
      component: Home
    }
  ]
})
