import request from '@/utils/request'

export function list(userId) {
  return request({
    url: '/ArticleComment/List',
    method: 'post',
    params: { userId: userId }
  })
}

export function listPager(data) {
  return request({
    url: '/ArticleComment/listPager',
    method: 'post',
    params: data
  })
}

export function insert(data) {
  return request({
    url: '/ArticleComment/Insert',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/ArticleComment/Update',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/ArticleComment/Delete',
    method: 'post',
    params: { id: id }
  })
}

export function get(id) {
  return request({
    url: '/ArticleComment/Get',
    method: 'post',
    params: { id: id }
  })
}
