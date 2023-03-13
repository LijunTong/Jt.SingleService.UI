import request from '@/utils/request'

export function list(userId) {
    return request({
        url: '/CodeDb/List',
        method: 'post',
        params: { userId: userId }
    })
}

export function listPager(data) {
    return request({
        url: '/CodeDb/listPager',
        method: 'post',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/CodeDb/Insert',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/CodeDb/Update',
        method: 'post',
        data
    })
}

export function del(id) {
    return request({
        url: '/CodeDb/Delete',
        method: 'post',
        params: { id: id }
    })
}

export function get(id) {
    return request({
        url: '/CodeDb/Get',
        method: 'post',
        params: { id: id }
    })
}
