import Vue from 'vue'
import Router from 'vue-router'

import calender from '@cmpt/calender/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'calender',
      component: calender,
    },
  ]
})
