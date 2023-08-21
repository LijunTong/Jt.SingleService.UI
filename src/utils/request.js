import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import * as tokenHelper from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 100000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + tokenHelper.getToken()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  async response => {
    const res = response.data
    if (res.code !== 1) {
      // 401 accessToken 过期了，登录过期了
      if (res.code === 1401) {
        const config = response.config
        const retry = await service.post('/User/RefreshToken')
          .then((res) => {
            const result = res
            if (result.code === 1) {
              tokenHelper.setToken(result.data);
              config.headers['Authorization'] = 'Bearer ' + result.data
              // 把异步改成同步的了
              var backoff = new Promise(function(resolve) {
                setTimeout(function() {
                  resolve()
                }, 500)
              })
              // Return the promise in which recalls axios to retry the request
              return backoff.then(function() {
                return axios(config)
              })
            }
            else {
              Message({
                message: result.msg,
                type: 'error',
                duration: 5 * 1000
              })
            }
          })
        return retry.data
      }
      // 402 refreshToken 过期了，转到登录页
      else if (res.code === 1402) {
        tokenHelper.removeToken()
        router.push({ path: '/login' })
      }
      // 403 资源无权访问
      else if (res.code === 1403) {
        Message({
          message: '无权访问',
          type: 'error',
          duration: 5 * 1000
        })
      }
      // 服务端异常
      else if(res.code >= 0) {
        Message({
          message: res.msg || '请求失败',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return res // Promise.reject(new Error(res.msg || 'Error')) //抛出异常，需要在后续处理
    } else {
      // 200 操作成功返回
      return res
    }
  },
  error => {
    Message({
      message: '请求异常',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
