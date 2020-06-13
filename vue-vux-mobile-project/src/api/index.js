/*
 * @Name: 分部分项-接口路径
 * @Author: 孔团兵
 * @Date: 2019年1月14日 14:50:57
 * @Last Modified by: 孔团兵
 */
// 基础路径
import { BaseUrl } from './baseUrl.js';
const api = {
  // 获取分部分项列表
  drawShareData: (projectId, shareId) =>
    `${BaseUrl}/projects/${projectId}/quantityMakeRecord/${shareId}/shareView`
};
export default api;
