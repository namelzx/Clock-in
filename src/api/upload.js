import request from '@util/request'


//要文轮播图
export function upload(data) {
    return request({
        url: 'upload',
        method: 'post',
        data
    })
};
