import Cookies from 'js-cookie'

export const AccessTokenKey = 'codegener_access_token'
export const RefreshTokenKey = 'codegener_refresh_token'
const UserId ='user_id_key'
const menu = 'menus'

export function getToken() {
  return Cookies.get(AccessTokenKey)
}

export function setToken(token) {
  return Cookies.set(AccessTokenKey, token, { expires: 14 })
}

export function removeToken() {
  removeUserId()
  return Cookies.remove(AccessTokenKey)
}

export function getUserId() {
  return Cookies.get(UserId)
}

export function setUserId(userId) {
  return Cookies.set(UserId, userId, { expires: 14 })
}

export function removeUserId() {
  return Cookies.remove(UserId)
}

export function setMenus(menus){
  return localStorage.setItem(menu,JSON.stringify(menus))
}
export function getMenus(){
  return JSON.parse(localStorage.getItem(menu))
}
export function removeMenus(){
  return localStorage.removeItem(menu)
}

