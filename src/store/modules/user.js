import { getToken, setToken, removeToken, getUserId, setUserId ,getMenus,setMenus,removeMenus} from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    username: '',
    userId: getUserId(),
    avatar: '',
    menus: getMenus()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USER_NAME: (state, username) => {
    state.username = username
  },
  SET_USER_ID: (state, id) => {
    state.userId = id
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  REMOVW_MENUS:(state)=>{
    state.menus = []
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, token, userId } = userInfo
    commit('SET_TOKEN', token)
    commit('SET_USER_NAME', username)
    commit('SET_USER_ID', userId)
    
    setToken(token)
    setUserId(userId)
  },

  setMenus({ commit },menus){
    commit('REMOVW_MENUS')
    commit('SET_MENUS', menus)
    removeMenus()
    setMenus(menus)
  },

  removeMenus({ commit }){
    removeMenus()
  },

  // get user info
  getInfo({ commit }, userInfo) {
    const { name } = userInfo
    commit('SET_NAME', name)
  },

  // user logout
  logout({ commit }) {
    removeToken() // must remove  token  first
    removeMenus()
    resetRouter()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({ commit }) {
    removeToken() // must remove  token  first
    removeMenus()
    resetRouter()
    commit('RESET_STATE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

