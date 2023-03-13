import request from '@/utils/request'

export function list(userId) {
    return request({
        url: '/SysLog/List',
        method: 'post',
        params: { userId: userId }
    })
}

export function listPager(data) {
    return request({
        url: '/SysLog/listPager',
        method: 'post',
        params: data
    })
}

export function insert(data) {
    return request({
        url: '/SysLog/Insert',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/SysLog/Update',
        method: 'post',
        data
    })
}

export function del(id) {
    return request({
        url: '/SysLog/Delete',
        method: 'post',
        params: { id: id }
    })
}

export function get(id) {
    return request({
        url: '/SysLog/Get',
        method: 'post',
        params: { id: id }
    })
}

export function getTotalStats() {
    return request({
        url: '/SysLog/GetTotalStats',
        method: 'post'
    })
}

export function getWeekTotalStats() {
    return request({
        url: '/SysLog/GetWeekTotalStats',
        method: 'post'
    })
}

export function getActionStats() {
    return request({
        url: '/SysLog/GetActionStats',
        method: 'post'
    })
}

export function getTodayActionStats() {
    return request({
        url: '/SysLog/GetTodayActionStats',
        method: 'post'
    })
}

export function getIpStats() {
    return request({
        url: '/SysLog/GetIpStats',
        method: 'post'
    })
}

export function getTodayIpStats() {
    return request({
        url: '/SysLog/GetTodayIpStats',
        method: 'post'
    })
}


export function getLogType() {
    return request({
        url: '/SysLog/GetLogType',
        method: 'post'
    })
}