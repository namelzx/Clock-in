import request from '@util/request'


//sign
export function postSchedule(data) {
    return request({
        url: 'postDataSchedule',
        method: 'post',
        data
    })
};

//sign
export function getSchedule(user_id) {
    return request({
        url: 'getDataSchedule',
        method: 'get',
        params:{user_id}
    })
};
