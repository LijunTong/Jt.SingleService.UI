import request from '@/utils/request'

export function list(userId) {
    return request({
        url: '/Tag/List',
        method: 'post',
        params: { userId: userId }
    })
}

export function listPager(data) {
    return request({
        url: '/Tag/listPager',
        method: 'post',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/Tag/Insert',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/Tag/Update',
        method: 'post',
        data
    })
}

export function del(id) {
    return request({
        url: '/Tag/Delete',
        method: 'post',
        params: { id: id }
    })
}

export function get(id) {
    return request({
        url: '/Tag/Get',
        method: 'post',
        params: { id: id }
    })
}
