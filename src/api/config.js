import request from '@util/request'


//获取配置信息
export function GetConfig() {
  return request({
    url: 'config/GetConfig',
    method: 'get',
  })
};
