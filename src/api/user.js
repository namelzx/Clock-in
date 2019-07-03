import request from '@util/request'


//sign
export function getDataByUser(id) {
    return request({
        url: 'userinfo',
        method: 'get',
        params: { id }
    })
};


export function getJssdk(url) {
    return request({
        url: 'getJssdk',
        method: 'get',
        params:{url}
    })
};

