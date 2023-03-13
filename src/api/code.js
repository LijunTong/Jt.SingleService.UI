import request from '@/utils/request'

export function setDb(data) {
    return request({
        url: '/CodeGenerator/SetDb',
        method: 'post',
        params: data
    })
}

export function getDataBases() {
    return request({
        url: '/CodeGenerator/GetDataBases',
        method: 'post',
    })
}

export function getTableNames(data) {
    return request({
        url: '/CodeGenerator/GetTableNames',
        method: 'post',
        params: data
    })
}

export function getDbFields(data) {
    return request({
        url: '/CodeGenerator/GetDbFields',
        method: 'post',
        params: data
    })
}

export function codeGenerator(data) {
    return request({
        url: '/CodeGenerator/CodeGenerator',
        method: 'post',
        data
    })
}

export function getSchemeDetials(schemeId,className,tableName) {
    return request({
        url: '/CodeGenerator/GetSchemeDetials',
        method: 'post',
        params: { schemeId ,className,tableName }
    })
}

export function downloadCode(fileName) {
    return request({
        url: '/CodeGenerator/GetCodeFile',
        method: 'post',
        params: { codeFileName: fileName},
        responseType: 'blob'
    })
}

export function getDbProvider() {
    return request({
        url: '/CodeGenerator/GetDbProvider',
        method: 'post'
    })
}