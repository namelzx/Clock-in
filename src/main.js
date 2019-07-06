// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { Toast, InfiniteScroll } from 'mint-ui'
// import { Auth } from './util/dataHandle.js'


import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

import store from './store/store'

import 'mint-ui/lib/style.css'
import '@style/common/reset.less'// 重置浏览器样式以及mint样式替换
import '@style/iconfont/iconfont.css'// 字体图标样式文件
Vue.config.productionTip = false

Vue.prototype.$toast = Toast;
Vue.use(InfiniteScroll)



import wx from "weixin-js-sdk";
import { getJssdk } from "@api/user";
import { getDataByUser } from "@api/user";

const _this = wx;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App,
    Toast
  },
  template: '<App/>',

  creatd() {
    
  }
})
