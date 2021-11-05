import { httpAxios } from '@/utils/index';
const pageService = '/api/page';

type getParamsType = {
  [propname: string]: any;
};
type postParamsType = {
  [propname: string]: any;
};
const sysApi = {
  get: (params: getParamsType = {}): Promise<any> => httpAxios.get(`${pageService}/get`, { params }),
  post: (data: postParamsType = {}): Promise<any> => httpAxios.post(`${pageService}/post`, data),
  // 添加页面
  postAddPage: (data: postParamsType = {}): Promise<any> => httpAxios.post(`${pageService}/add`, data),
  // 删除页面
  postDelPage: (data: postParamsType = {}): Promise<any> => httpAxios.post(`${pageService}/deletePage`, data),
  // 修改保存
  postEditSavePage: (data: postParamsType = {}): Promise<any> => httpAxios.post(`${pageService}/editSave`, data)
};

export default sysApi;
