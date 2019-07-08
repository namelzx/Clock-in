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

import VueQuillEditor from 'vue-quill-editor'
//一定要引入这三个css，不然文本编辑器会出现不规则黑白几何图形
//这三个css可以在main.js中引入，也可以在具体使用的.vue文件中引入
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)




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
