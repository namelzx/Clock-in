import Vue from 'vue'
import Router from 'vue-router'

import calender from '@/page/calender/index'

import detailed from '@/page/detailed/index'


import Index from '@/page/index/index'



import Add from '@/page/add/index'

Vue.use(Router)

export default new Router({
  routes: [
    //首页
    {
      path: '/',
      name: 'Index',
      component: Index,
    },
    //查看日程
    {
      path: '/calender/:id',
      name: 'calender',
      component: calender,
    },
  // 查看详细
    {
      path: '/detailed/:id',
      name: 'detailed',
      component: detailed,
    },
    //创建主题
    {
      path: '/add',
      name: 'Add',
      component: Add,
    },

    
  ]
})
