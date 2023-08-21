import request from '@/utils/request'

export function list(userId) {
  return request({
    url: '/CodeGenScheme/List',
    method: 'post',
    params: { userId: userId }
  })
}
export function listPager(data) {
  return request({
    url: '/CodeGenScheme/listPager',
    method: 'post',
    params: data
  })
}
export function insert(data) {
  return request({
    url: '/CodeGenScheme/Insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/CodeGenScheme/Insert',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/CodeGenScheme/Delete',
    method: 'post',
    params: { id: id }
  })
}

export function get(id) {
  return request({
    url: '/CodeGenScheme/Get',
    method: 'post',
    params: { id: id }
  })
}

export function getSchemeDetials(schemeId) {
  return request({
    url: '/CodeGenScheme/GetSchemeDetials',
    method: 'post',
    params: { schemeId: schemeId }
  })
}
