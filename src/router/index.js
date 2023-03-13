import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import * as menuApi from '@/api/menu'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

import FrontLayout from '@/layout/FrontLayout'

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
    path: '/',
    redirect:'/stats',
    component: Layout,
    hidden: false,
    children: [{
      name:'stats',
      path: '/stats',
      component: () => import('@/views/dashboard/stats'),
      meta: { title: '首页',icon:'iconfont icon-dashboard',affix:true }
    }]
  },
  {
    path: '/system',
    redirect:'/menu',
    component: Layout,
    hidden: false,
    meta: { title: '系统管理',icon:'iconfont icon-setting' },
    children: [{
      name:'menus',
      path: '/menu',
      component: () => import('@/views/menu/indexv2'),
      meta: { title: '权限管理',icon:'iconfont icon-menu' }
    },{
      name:'user',
      path: '/user',
      component: () => import('@/views/user/index'),
      meta: { title: '用户管理',icon:'iconfont icon-user' }
    },{
      name:'role',
      path: '/role',
      component: () => import('@/views/role/index'),
      meta: { title: '角色管理',icon:'iconfont icon-safetycertificate-f' }
    },{
      name:'user_info',
      path: '/user/info',
      component: () => import('@/views/user/info'),
      meta: { title: '个人信息',icon:'iconfont icon-user' }
    }]
  },
  {
    path: '/log',
    redirect:'/sys_log',
    component: Layout,
    hidden: false,
    meta: { title: '日志管理',icon:'iconfont icon-reconciliation' },
    children: [{
      name:'sys_log',
      path: '/sys_log',
      component: () => import('@/views/sys_log/index'),
      meta: { title: '系统日志',icon:'iconfont icon-read' }
    }]
  },
  {
    path: '/codegener',
    redirect:'/code',
    component: Layout,
    hidden: false,
    meta: { title: '代码平台',icon:'iconfont icon-code' },
    children: [{
      name:'code_db',
      path: '/code_db',
      component: () => import('@/views/code_db/index'),
      meta: { title: '数据源',icon:'iconfont icon-database' }
    },{
      name:'code_temp',
      path: '/code_temp',
      component: () => import('@/views/code_temp/index'),
      meta: { title: '代码模板',icon:'iconfont icon-file-text' }
    },{
      name:'code_gen_scheme',
      path: '/code_gen_scheme',
      component: () => import('@/views/code_gen_scheme/index'),
      meta: { title: '模板方案',icon:'iconfont icon-shop' }
    },{
      name:'code',
      path: '/code',
      component: () => import('@/views/code/index'),
      meta: { title: '代码生成',icon:'iconfont icon-appstoreadd' }
    }]
  },
  {
    path: '/404',
    component: FrontLayout,
    hidden: true,
    children: [{
      path: '',
      component: () => import('@/views/404'),
      meta: { title: '404' }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

 const createRouter = () => {
  return new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: defaultRoutes
  })
}

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}


function initRoutesV2(menu) {
  let route = {}
  if (menu.children.length > 0) {
    if (menu.parentId > 0) {//不是根节点，根节点和子节点处理方式有些不一样
      let redirect = menu.children[0].redirect//连接指向第一个子节点
      route = {
        path: menu.path,
        name: menu.name,
        component: (resolve) => require([`@/views${menu.redirect}`], resolve),//继承layout布局
        hidden: !menu.hidden,
        meta: { title: menu.title, icon: menu.icon, affix: menu.affix },//, affix: true
        children: []
      }
    }
    else {
      route = {
        path: menu.path,
        name: menu.name,
        component: menu.type == 0 ? Layout : FrontLayout,//继承layout布局
        hidden: !menu.hidden,
        meta: { title: menu.title, icon: menu.icon, affix: menu.affix },//, affix: true
        children: []
      }
    }
    menu.children.forEach(element => {
      route.children.push(initRoutesV2(element))
    })
  }
  else {
    if (menu.parentId == 0) {
      route = {
        name: menu.name + "1",
        path: menu.path,
        component: Layout,//继承layout布局
        hidden: !menu.hidden,
        redirect: menu.redirect,
        children: [{
          name: menu.name,
          path: menu.path,
          component: (resolve) => require([`@/views${menu.redirect}`], resolve),
          meta: { title: menu.title, icon: menu.icon, affix: menu.affix }
        }]
      }
    }
    else {
      route = {
        name: menu.name,
        path: menu.path,
        component: (resolve) => require([`@/views${menu.redirect}`], resolve),
        meta: { title: menu.title, icon: menu.icon, affix: menu.affix },
        hidden: !menu.hidden,
      }
    }
  }
  return route;
}


function initRoutes(menus, menuId, routes, route) {
  if (!menus || menus.length === 0) {
    return
  }
  let children = menus.filter(x => x.parentId === menuId).sort(function (a, b) { return a.sortIndex - b.sortIndex });//获取子节点

  if (children.length > 0) {
    children.forEach(element => {//遍历子节点
      let child = {}
      if (menuId === 0) {//根节点
        if (menus.filter(x => x.parentId == element.id).length > 0) {//如果子节点，存在孙子节点
          child = {
            name: element.name,
            path: element.path,
            component: Layout,//继承layout布局
            hidden: !element.hidden,
            redirect: element.redirect,
            meta: { title: element.title, icon: element.icon, affix: element.affix },//, affix: true
            children: []
          }
          initRoutes(menus, element.id, routes, child)
        }
        else {
          child = {
            name: element.name + "1",
            path: element.path,
            component: Layout,//继承layout布局
            hidden: !element.hidden,
            redirect: element.redirect,
            children: [{
              name: element.name,
              path: element.path,
              component: (resolve) => require([`@/views${element.redirect}`], resolve),
              meta: { title: element.title, icon: element.icon, affix: element.affix }
            }]
          }

        }
        routes.push(child)

      }
      else {//子节点
        if (menus.filter(x => x.parentId == element.id).length > 0) {//如果子节点，存在孙子节点
          child = {
            name: element.name,
            path: element.path,
            redirect: element.redirect,
            hidden: !element.hidden,
            meta: { title: element.title, icon: element.icon, affix: element.affix },//, affix: true
            children: []
          }
          this.initRoutes(menus, element.id, routes, child)
        }
        else {
          child = {
            name: element.name,
            path: element.path,
            hidden: !element.hidden,
            component: (resolve) => require([`@/views${element.redirect}`], resolve),
            meta: { title: element.title, icon: element.icon, affix: element.affix }

          }

        }
        route.children.push(child)

      }
    });
  }
}


export default router
