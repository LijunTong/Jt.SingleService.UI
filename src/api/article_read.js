import request from '@/utils/request'

export function list(userId) {
    return request({
        url: '/ArticleRead/List',
        method: 'post',
        params: { userId: userId }
    })
}

export function listPager(data) {
    return request({
        url: '/ArticleRead/listPager',
        method: 'post',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/ArticleRead/Insert',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/ArticleRead/Update',
        method: 'post',
        data
    })
}

export function del(id) {
    return request({
        url: '/ArticleRead/Delete',
        method: 'post',
        params: { id: id }
    })
}

export function get(id) {
    return request({
        url: '/ArticleRead/Get',
        method: 'post',
        params: { id: id }
    })
}
