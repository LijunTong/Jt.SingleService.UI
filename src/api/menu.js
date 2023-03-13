import request from '@/utils/request'

export function list() {
    return request({
        url: '/Menu/List',
        method: 'post',
    })
}

export function listPager(data) {
    return request({
        url: '/Menu/listPager',
        method: 'post',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/Menu/Insert',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/Menu/Update',
        method: 'post',
        data
    })
}

export function del(id) {
    return request({
        url: '/Menu/Delete',
        method: 'post',
        params: { id: id }
    })
}

export function get(id) {
    return request({
        url: '/Menu/Get',
        method: 'post',
        params: { id: id }
    })
}

export function getMenuTree() {
    return request({
        url: '/Menu/GetMenuTree',
        method: 'post',
    })
}

export function getMenuTreeWithAction() {
    return request({
        url: '/Menu/GetMenuTreeWithAction',
        method: 'post',
    })
}

export function getActions() {
    return request({
        url: '/Menu/GetActions',
        method: 'post',
    })
}

export function getController() {
    return request({
        url: '/Menu/GetController',
        method: 'post',
    })
}

export function initController() {
    return request({
        url: '/Menu/InitController',
        method: 'post',
    })
}

export function getMenuType() {
    return request({
        url: '/Menu/GetMenuType',
        method: 'post',
    })
}


export function getFrontMenu() {
    return request({
        url: '/Menu/GetFrontMenu',
        method: 'post',
    })
}

export function getMenu(path) {
    return request({
        url: '/Menu/GetMenuByPath',
        method: 'post',
        params: { path }
    })
}

export function bindController(data) {
    return request({
        url: '/Menu/BindController',
        method: 'post',
        data
    })
}
