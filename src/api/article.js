import request from '@/utils/request'

export function list(userId) {
    return request({
        url: '/Article/List',
        method: 'post',
        params: { userId: userId }
    })
}

export function listPager(data) {
    return request({
        url: '/Article/listPager',
        method: 'post',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/Article/Insert',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/Article/Update',
        method: 'post',
        data
    })
}

export function del(id) {
    return request({
        url: '/Article/Delete',
        method: 'post',
        params: { id: id }
    })
}

export function get(id) {
    return request({
        url: '/Article/Get',
        method: 'post',
        params: { id: id }
    })
}

export function getArticleByColumn(data) {
    return request({
        url: '/Article/getArticleByColumn',
        method: 'post',
        data
    })
}
