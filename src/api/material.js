import request from '@util/request'


//sign
export function postmateial(data) {
    return request({
        url: 'material',
        method: 'post',
        data
    })
};
