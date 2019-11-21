/*
 * @Name: 分部分项-接口路径
 * @Author: 孔团兵
 * @Date: 2019年1月14日 14:50:57
 * @Last Modified by: 孔团兵
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
