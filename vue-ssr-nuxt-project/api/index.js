const serverEss = '/hrd-ess-service'
const userAuth = '/hrd-userauth-service'
const baseApi = '/api'
const apiVersion = '/v1'

const api = {
  // 登录
  postLogin: () => `${userAuth}${baseApi}${apiVersion}/account/login`,
  // 换取token
  getUserInfoByToken: () => `${userAuth}${baseApi}${apiVersion}/user/profile`,
  // 获取用户信息
  getUserInfo: () => `${serverEss}${baseApi}${apiVersion}/ess/baseInfo`,
}

export default api
