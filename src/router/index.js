import Vue from 'vue'
import Router from 'vue-router'

import calender from '@/page/calender/index'

import detailed from '@/page/detailed/index'
import detailedAdd from '@/page/detailed/add/index'


import Index from '@/page/index/index'



import Add from '@/page/add/index'


import Test from '@/page/test/index'


import Posters from '@/page/posters/index'


import Schedule from '@/page/schedule/index'



Vue.use(Router)

export default new Router({
  routes: [
    //首页
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    {
      path: '/test/:id',
      name: 'test',
      component: Test,
    },
    //查看日程
    {
      path: '/calender',
      name: 'calender',
      component: calender,
    },
    // 查看详细
    {
      path: '/detailed/:id',
      name: 'detailed',
      component: detailed,
    },
    {
      path: '/detailed',
      name: 'detailed',
      component: detailed,
    },
    //生成海报
    {
      path: '/Posters/',
      name: 'Posters',
      component: Posters,
    },
    //创建主题
    {
      path: '/add',
      name: 'Add',
      component: Add,
    },

     //日程提醒
     {
      path: '/schedule',
      name: 'Schedule',
      component: Schedule,
    },

    

  ]
})
