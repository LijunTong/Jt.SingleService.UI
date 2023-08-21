import request from '@/utils/request'

export function list(userId) {
    return request({
        url: '/ArticleLike/List',
        method: 'post',
        params: { userId: userId }
    })
}

export function listPager(data) {
    return request({
        url: '/ArticleLike/listPager',
        method: 'post',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/ArticleLike/Insert',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/ArticleLike/Update',
        method: 'post',
        data
    })
}

export function del(id) {
    return request({
        url: '/ArticleLike/Delete',
        method: 'post',
        params: { id: id }
    })
}

export function get(id) {
    return request({
        url: '/ArticleLike/Get',
        method: 'post',
        params: { id: id }
    })
}
