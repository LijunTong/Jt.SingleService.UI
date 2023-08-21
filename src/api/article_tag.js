import request from '@/utils/request'

export function list(userId) {
    return request({
        url: '/ArticleTag/List',
        method: 'post',
        params: { userId: userId }
    })
}

export function listPager(data) {
    return request({
        url: '/ArticleTag/listPager',
        method: 'post',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/ArticleTag/Insert',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/ArticleTag/Update',
        method: 'post',
        data
    })
}

export function del(id) {
    return request({
        url: '/ArticleTag/Delete',
        method: 'post',
        params: { id: id }
    })
}

export function get(id) {
    return request({
        url: '/ArticleTag/Get',
        method: 'post',
        params: { id: id }
    })
}
