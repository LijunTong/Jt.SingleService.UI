import request from '@/utils/request'

export function list(userId) {
  return request({
    url: '/CodeTemp/List',
    method: 'post',
    params: { userId: userId }
  })
}

export function listPager(data) {
  return request({
    url: '/CodeTemp/listPager',
    method: 'post',
    params: data
  })
}

export function insert(data) {
  return request({
    url: '/CodeTemp/Insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/CodeTemp/Update',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/CodeTemp/Delete',
    method: 'post',
    params: { id: id }
  })
}

export function get(id) {
  return request({
    url: '/CodeTemp/Get',
    method: 'post',
    params: { id: id }
  })
}

export function getTempsByScheme(schemeId) {
  return request({
    url: '/CodeTemp/GetTempsByScheme',
    method: 'post',
    params: { schemeId: schemeId }
  })
}
