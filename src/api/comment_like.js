import request from '@/utils/request'

export function list(userId) {
    return request({
        url: '/CommentLike/List',
        method: 'post',
        params: { userId: userId }
    })
}

export function listPager(data) {
    return request({
        url: '/CommentLike/listPager',
        method: 'post',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/CommentLike/Insert',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/CommentLike/Update',
        method: 'post',
        data
    })
}

export function del(id) {
    return request({
        url: '/CommentLike/Delete',
        method: 'post',
        params: { id: id }
    })
}

export function get(id) {
    return request({
        url: '/CommentLike/Get',
        method: 'post',
        params: { id: id }
    })
}
