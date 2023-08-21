import Vue from 'vue'
import Router from 'vue-router'
import { getMenus } from '@/utils/auth'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const defaultRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true
  },
  {
    path: '/404',
    component: Layout,
    hidden: true,
    children: [{
      path: '',
      component: () => import('@/views/404'),
      meta: { title: '404' }
    }]
  }
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => {
  const constantRoutes = []
  defaultRoutes.forEach(element => {
    constantRoutes.push(element)
  })

  // 从缓存中取出菜单，菜单再登录的时候会初始化，点击右上角同步按钮也会初始化
  const menus = getMenus()
  if (menus && menus.length > 0) {
    menus.forEach(element => {
      constantRoutes.push(initRoutes(element))
    })
  }
  const route404 = { path: '*', redirect: '/404', hidden: true }// 404 page must be placed at the end !!!
  constantRoutes.push(route404)
  return new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })
}

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

function initRoutes(menu) {
  let route = {}
  if (menu.children.length > 0) { // 存在子节点
    if (menu.parentId > 0) { // 不是根节点，根节点和子节点处理方式有些不一样
      route = {
        path: menu.path,
        name: menu.name,
        component: (resolve) => require([`@/views${menu.redirect}`], resolve), // 继承layout布局
        hidden: !menu.hidden,
        type: menu.type,
        meta: { title: menu.title, icon: menu.icon, affix: menu.affix }, //, affix: true
        children: []
      }
    } else {
      route = {
        path: menu.path,
        name: menu.name,
        component: Layout, // 继承layout布局
        hidden: !menu.hidden,
        type: menu.type,
        meta: { title: menu.title, icon: menu.icon, affix: menu.affix }, //, affix: true
        children: []
      }
    }
    menu.children.forEach(element => {
      route.children.push(initRoutes(element))
    })
  } else { // 不存在子节点
    if (!menu.parentId) {
      route = {
        name: menu.name + '1',
        path: menu.path,
        component: Layout, // 继承layout布局
        hidden: !menu.hidden,
        type: menu.type,
        redirect: menu.redirect,
        children: [{
          name: menu.name,
          path: menu.path,
          component: (resolve) => require([`@/views${menu.redirect}`], resolve),
          meta: { title: menu.title, icon: menu.icon, affix: menu.affix }
        }]
      }
    } else {
      route = {
        name: menu.name,
        path: menu.path,
        component: (resolve) => require([`@/views${menu.redirect}`], resolve),
        meta: { title: menu.title, icon: menu.icon, affix: menu.affix },
        hidden: !menu.hidden,
        type: menu.type
      }
    }
  }
  return route
}

export function initRoutes2(menu) {
  return initRoutes(menu)
}

export default router
