import { RouteRecordRaw } from 'vue-router';

const editorRouter: Array<RouteRecordRaw> = [
  {
    path: '/managerPage',
    name: 'ManagerPage',
    component: () => import('@/admin/pages/managerPage/ManagerPage'),
    meta: {
      title: '页面管理'
    }
  },
  {
    path: '/editPage/:pageId',
    name: 'EditPage',
    component: () => import('@/admin/pages/editPage/EditPage'),
    meta: {
      title: '页面编辑'
    }
  }
];

export default editorRouter;
