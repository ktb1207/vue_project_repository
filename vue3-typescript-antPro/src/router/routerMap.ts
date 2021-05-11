import { RouteRecordRaw } from 'vue-router';

export const routerMap: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/page/home/Home.vue'),
    meta: {
      title: '首页',
      requireLogin: true
    }
  },
  {
    path: '/featureSetting',
    name: 'FeatureSetting',
    component: () => import('@/page/featureSetting/FeatureSetting.vue'),
    meta: {
      title: '功能设置',
      requireLogin: true
    }
  },
  {
    path: '/platformClassify/:classifyType',
    name: 'PlatformClassify',
    component: () => import('@/page/platformClassify/PlatformClassify.vue'),
    meta: {
      title: '平台中心',
      requireLogin: true
    },
    children: [
      // 物资采购-采购管理
      {
        path: 'purchaseManager',
        name: 'PurchaseManager',
        component: () => import('@/views/goodsPurchase/PurchaseManager.vue'),
        meta: {
          title: '采购管理',
          keepAlive: true
        }
      },
      // 油品销售-油品批发
      {
        path: 'oilsWholesale',
        name: 'OilsWholesale',
        component: () => import('../views/oilsSell/OilsWholesale.vue'),
        meta: {
          title: '油品批发',
          keepAlive: true
        }
      },
      // 系统管理-组织机构管理
      {
        path: 'organManage',
        name: 'OrganManage',
        component: () => import('../views/systemManage/OrganManage.vue'),
        meta: {
          title: '组织机构管理',
          keepAlive: true
        }
      },
      // 系统管理-用户管理
      {
        path: 'userManage',
        name: 'UserManage',
        component: () => import('../views/systemManage/UserManage.vue'),
        meta: {
          title: '用户管理',
          keepAlive: true
        }
      },
      // 系统管理-角色管理
      {
        path: 'roleManage',
        name: 'RoleManage',
        component: () => import('../views/systemManage/RoleManage.vue'),
        meta: {
          title: '角色管理',
          keepAlive: true
        }
      },
      // 系统管理-菜单管理
      {
        path: 'menuManage',
        name: 'MenuManage',
        component: () => import('../views/systemManage/MenuManage.vue'),
        meta: {
          title: '菜单管理',
          keepAlive: true
        }
      },
      // 系统管理-岗位管理
      {
        path: 'positionManage',
        name: 'PositionManage',
        component: () => import('../views/systemManage/PositionManage.vue'),
        meta: {
          title: '岗位管理',
          keepAlive: true
        }
      },
      // 系统管理-字典管理
      {
        path: 'dictionaryManage',
        name: 'DictionaryManage',
        component: () => import('../views/systemManage/DictionaryManage.vue'),
        meta: {
          title: '字典管理',
          keepAlive: true
        }
      },
      // 系统管理-字典数据
      {
        path: 'dictionaryData',
        name: 'DictionaryData',
        component: () => import('../views/systemManage/DictionaryData.vue'),
        meta: {
          title: '字典数据',
          keepAlive: true
        }
      },
      // 系统管理-通知公告
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('../views/systemManage/Notifications.vue'),
        meta: {
          title: '通知公告',
          keepAlive: true
        }
      },
      // 日志管理-操作日志
      {
        path: 'operationLogs',
        name: 'OperationLogs',
        component: () => import('../views/logManage/OperationLogs.vue'),
        meta: {
          title: '操作日志',
          keepAlive: true
        }
      },
      // 日志管理-登录日志
      {
        path: 'loggingLogs',
        name: 'LoggingLogs',
        component: () => import('../views/logManage/LoggingLogs.vue'),
        meta: {
          title: '登录日志',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/page/About.vue'),
    meta: {
      title: '关于',
      requireLogin: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/page/Login.vue'),
    meta: {
      title: '登录',
      requireLogin: false
    }
  },
  {
    path: '/notFound',
    name: 'NotFound',
    component: () => import('@/page/NotFound.vue'),
    meta: {
      title: '404',
      requireLogin: false
    }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/page/Forbid.vue'),
    meta: {
      title: '403',
      requireLogin: false
    }
  }
];
