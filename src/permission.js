import router from './router'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import * as tokenHelper from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getMenus, setMenus } from '@/utils/auth'
import * as menuApi from '@/api/menu'
import { initRoutes2, resetRouter } from '@/router'

NProgress.configure({ showSpinner: true }) // NProgress Configuration

const whiteList = ['/login', '/register', '/front'] // no redirect whitelist
const isReload = true

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = tokenHelper.getToken(tokenHelper.AccessTokenKey)
  // 测试环境，不需要权限
  // next()
  // return
  if (to.path === '/register') {
    // 注册页 无需登录
    next()
  } else if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // console.log(router)
      // var r = await menuApi.getMenuTree()
      // const routes = []
      // if (r.code === 1) {
      //   resetRouter()
      //   r.data.forEach(element => {
      //     routes.push(initRoutes2(element))
      //   })
      //   console.log(routes)
      //   router.addRoutes(routes)
      //   console.log(router)
      // }
      // console.log(r)
      // console.log(2)
      next()
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      Message.error('请先登录')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
