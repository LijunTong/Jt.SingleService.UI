import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
Vue.use(ElementUI, { locale })

import './assets/icons/iconfont/ant/iconfont.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import components from '@/utils/components.js'
Vue.use(components)

import VueClipBoard from 'vue-clipboard2'
Vue.use(VueClipBoard)

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

// 图标选择器，其实不建议全局注册
import eIconPicker from 'e-icon-picker'
import 'e-icon-picker/lib/symbol.js' // 基本彩色图标库
import 'e-icon-picker/lib/index.css' // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css' // font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css' // element-ui 图标库
import { analyzingIconForIconfont } from 'e-icon-picker' // 引入解析json的函数
import iconfont from './assets/icons/iconfont/ant/iconfont.json' // 引入json文件

const forIconfont = analyzingIconForIconfont(iconfont)// 解析class
// 全局删除增加图标
Vue.use(eIconPicker, {
  FontAwesome: false,
  ElementUI: false,
  eIcon: true, // 自带的图标，来自阿里妈妈
  eIconSymbol: true, // 是否开启彩色图标
  addIconList: forIconfont.list,
  removeIconList: [],
  zIndex: 3100// 选择器弹层的最低层,全局配置
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
