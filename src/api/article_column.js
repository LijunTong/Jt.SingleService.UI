import request from '@/utils/request'

export function list(userId) {
  return request({
    url: '/ArticleColumn/List',
    method: 'post',
    params: { userId: userId }
  })
}

export function listPager(data) {
  return request({
    url: '/ArticleColumn/listPager',
    method: 'post',
    params: data
  })
}

export function insert(data) {
  return request({
    url: '/ArticleColumn/Insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/ArticleColumn/Update',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/ArticleColumn/Delete',
    method: 'post',
    params: { id: id }
  })
}

export function get(id) {
  return request({
    url: '/ArticleColumn/Get',
    method: 'post',
    params: { id: id }
  })
}
