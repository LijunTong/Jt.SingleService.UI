import request from '@/utils/request'

export function list(userId) {
    return request({
        url: '/UserFollow/List',
        method: 'post',
        params: { userId: userId }
    })
}

export function listPager(data) {
    return request({
        url: '/UserFollow/listPager',
        method: 'post',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/UserFollow/Insert',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/UserFollow/Update',
        method: 'post',
        data
    })
}

export function del(id) {
    return request({
        url: '/UserFollow/Delete',
        method: 'post',
        params: { id: id }
    })
}

export function get(id) {
    return request({
        url: '/UserFollow/Get',
        method: 'post',
        params: { id: id }
    })
}
