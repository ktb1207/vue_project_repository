/*
 * @Author: kongtb 
 * @Date: 2020-06-09 16:22:39 
 * @Last Modified by: kongtb
 * @Last Modified time: 2020-06-09 16:23:43
 */
// 基础路径
const baseUrl = '/api';
const apiVersion = '/v1';
const api = {
  // 埋点
  reqTJ: (projectId, code) => `${baseUrl}/v1/projects/${projectId}/tj/${code}`,
  // 获取分部分项列表
  getTreeData: projectId =>
    `${baseUrl}/v1/projects/${projectId}/dict/partAndKinds/list`
};

export function url(name, _store, params = {}) {
  if (_store) {
    params.id = _store.state.projectId;
  }
  return baseUrl + apiVersion + api[name](params);
}
export default api;
