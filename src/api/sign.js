import request from '@util/request'


//sign
export function PostDataByAdd(data) {
    return request({
        url: 'sign/PostDataByAdd',
        method: 'post',
        data
    })
};
