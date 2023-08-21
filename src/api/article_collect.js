import request from '@/utils/request'

export function list(userId) {
  return request({
    url: '/ArticleCollect/List',
    method: 'post',
    params: { userId: userId }
  })
}

export function listPager(data) {
  return request({
    url: '/ArticleCollect/listPager',
    method: 'post',
    params: data
  })
}

export function insert(data) {
  return request({
    url: '/ArticleCollect/Insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/ArticleCollect/Update',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/ArticleCollect/Delete',
    method: 'post',
    params: { id: id }
  })
}

export function get(id) {
  return request({
    url: '/ArticleCollect/Get',
    method: 'post',
    params: { id: id }
  })
}
