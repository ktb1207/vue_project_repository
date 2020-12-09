const Router = require("vue-router");
const Vue = require("vue");

Vue.use(Router)

module.exports = function createRouter () {
  return new Router ({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue')
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('../views/About.vue')
      }
    ]
  })
}