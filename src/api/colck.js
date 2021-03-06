import request from '@util/request'

export function getWxConfig(query){
    return request({
        url: '/wechat/Wx/getWxConfig',
        method: 'get',
        params:query
    })
}

//要文轮播图
export function PostDataByAdd(data) {
    return request({
        url: 'PostDataByAdd',
        method: 'post',
        data
    })
};

//要文轮播图
export function getTheme(id) {
  return request({
    url: 'gettheme',
    method: 'get',
    params:{id}
  })
};

//要文轮播图
export function GetIdByThemeByDel(id) {
  return request({
    url: 'GetIdByThemeByDel',
    method: 'get',
    params:{id}
  })
};





export function GetDataByList(query) {
    return request({
        url: 'GetDataByList',
        method: 'get',
        params:query
    })
};


export function GetIdBydetailed(query) {
    return request({
        url: 'GetIdBydetailed',
        method: 'get',
        params:query
    })
};


export function GetIdByUnsuDelete(query) {
    return request({
        url: 'GetIdByUnsuDelete',
        method: 'get',
        params:query
    })
};



export function postPunch(data) {
  return request({
    url: 'postPunch',
    method: 'post',
    data
  })
};









