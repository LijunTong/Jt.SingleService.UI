import request from '@/utils/request'

export function login(userInfo) {
  return request({
    url: '/User/Login',
    method: 'post',
    data: userInfo
  })
}

export function register(userInfo) {
  return request({
    url: '/User/Register',
    method: 'post',
    data: userInfo
  })
}

export function checkUserName(name) {
  return request({
    url: '/User/CheckUserName',
    method: 'post',
    params: { 'userName': name }
  })
}

export function getInfo(userId) {
  return request({
    url: '/User/GetUserInfo',
    method: 'post',
    params: { userId: userId }
  })
}

export function logout() {
  return request({
    url: '/User/Logout',
    method: 'post'
  })
}

export function editPwd(data) {
  return request({
    url: '/User/EditPassword',
    method: 'post',
    params: data
  })
}

export function list() {
  return request({
      url: '/User/List',
      method: 'post',
  })
}

export function listPager(data) {
  return request({
      url: '/User/listPager',
      method: 'post',
      params: data
  })
}

export function insert(data) {
  return request({
      url: '/User/Insert',
      method: 'post',
      data
  })
}

export function update(data) {
  return request({
      url: '/User/Update',
      method: 'post',
      data
  })
}

export function del(id) {
  return request({
      url: '/User/Delete',
      method: 'post',
      params: { id: id }
  })
}

export function get(id) {
  return request({
      url: '/User/Get',
      method: 'post',
      params: { id: id }
  })
}


export function bindUserRole(userRoles) {
  return request({
      url: '/User/BindUserRole',
      method: 'post',
      data:  userRoles 
  })
}