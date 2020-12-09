export default function ({ $axios, redirect }) {
  $axios.setHeader('crossDomain', true)
  // 请求token
  if (process.client) {
    const localToken = localStorage.getItem('loginToken')
    if (localToken !== null && localToken !== '') {
      $axios.setHeader('token', localToken)
    }
  }
  // request
  $axios.onRequest((config) => {
    // get请求
    if (config.method === 'get') {
      if (process.client) {
        // get token单独处理
        const localToken = localStorage.getItem('loginToken')
        config.params = {
          token: localToken,
          ...config.params,
          _t: Date.parse(new Date()) / 1000,
        }
      } else {
        config.params = {
          ...config.params,
          _t: Date.parse(new Date()) / 1000,
        }
      }
    } else if (config.method === 'post') {
      console.log(config.data)
    } else if (config.method === 'delete') {
      config.params = {
        ...config.params,
        _t: Date.parse(new Date()) / 1000,
      }
    }
    return config
  })
  // response
  $axios.onResponse((response) => {
    if (response.data.code !== '200' && process.client) {
      alert(response.data.message)
    }
    return response
  })
  // error
  $axios.onError((err) => {
    if (err.response && err.response.status) {
      const code = parseInt(err.response.status)
      let msg = ''
      switch (code) {
        // 错误代码
        case 401:
          msg = '未登录'
          // redirect('/login')
          break
        case 404:
          msg = '请求地址不存在'
          break
        case 500:
          msg = '服务器内部错误'
          break
        case 502:
          msg = 'Bad Gateway'
          break
        case 503:
          msg = err.message
          break
        case 504:
          msg = err.message
          break
        default:
          msg = '请求位置错误'
          break
      }
      if (process.client) {
        alert(msg)
      }
    }
    return err
  })
}
