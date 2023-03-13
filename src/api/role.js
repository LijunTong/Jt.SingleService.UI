import request from '@/utils/request'

export function list() {
    return request({
        url: '/Role/List',
        method: 'post',
    })
}

export function listPager(data) {
    return request({
        url: '/Role/listPager',
        method: 'post',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/Role/Insert',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/Role/Update',
        method: 'post',
        data
    })
}

export function del(id) {
    return request({
        url: '/Role/Delete',
        method: 'post',
        params: { id: id }
    })
}

export function get(id) {
    return request({
        url: '/Role/Get',
        method: 'post',
        params: { id: id }
    })
}

export function bindRoleAction(data) {
    return request({
        url: '/Role/BindRoleActions',
        method: 'post',
        data
    })
}
