import request from '@/utils/request'

export function list(userId) {
    return request({
        url: '/Column/List',
        method: 'post',
        params: { userId: userId }
    })
}

export function listPager(data) {
    return request({
        url: '/Column/listPager',
        method: 'post',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/Column/Insert',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/Column/Update',
        method: 'post',
        data
    })
}

export function del(id) {
    return request({
        url: '/Column/Delete',
        method: 'post',
        params: { id: id }
    })
}

export function get(id) {
    return request({
        url: '/Column/Get',
        method: 'post',
        params: { id: id }
    })
}
