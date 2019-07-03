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

// 路由没配noLogin(需要登录)的都判断是否有token。若无则跳转登录页面
// router.beforeEach(function (to, from, next) {
//   if (!to.meta.noLogin && !Auth.getToken()) {
//     Toast('未登录')
//     setTimeout(() => {
//       next({
//         path: '/login'
//       })
//     }, 1000);
//   }
//   next()
// });

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

    this.fullPath = location.href
    if (
      this.$route.query.user_id === undefined &&
      this.$store.state.user_id === 0
    ) {
      // if (this.$route.query.id!==undefined) {
      //   window.location.href = "http://clock.10huisp.com?url="+this.$route.fullPath;
      // }else{
      //   window.location.href = "http://clock.10huisp.com/";

      // }
    }
    if (this.$route.query.user_id > 0) {
      getDataByUser(this.$route.query.user_id).then(res => {
        this.$store.state.userInfo = res.data;
        this.$store.state.user_id = res.data.id;
      });
    }
    getJssdk(this.fullPath)
      .then(res => {
        // console.log(res)
        let list = res.data;
        _this.config({
          appId: list.appId, // 必填，公众号的唯一标识
          timestamp: list.timestamp, // 必填，生成签名的时间戳
          nonceStr: list.nonceStr, // 必填，生成签名的随机串
          signature: list.signature, // 必填，签名
          jsApiList: [
            "startRecord",
            "translateVoice",
            "stopRecord",
            "playVoice",
            "pauseVoice",
            "stopVoice",
            "uploadVoice",
            "downloadVoice",
            "downloadVoice",
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
          ] // 必填，需要使用的JS接口列表
          // 接口 开始录音接口 停止录音接口 播放语音接口 暂停播放接口 停止播放接口 上传语音接口 下载语音接口 识别音频并返回识别结果接口
        });
        // config信息验证后才执行
        _this.ready(() => {

        });
        _this.onMenuShareTimeline({
          title: "分享描述", // 分享标题
          desc: "分享描述", //分享描述
          link: 'www.baidu.com', // 分享链接
          imgUrl: 'http://img0.imgtn.bdimg.com/it/u=413241571,1035325901&fm=26&gp=0.jpg' // 图片
        })
        wx.onMenuShareAppMessage({
          title: "分享描述", // 分享标题
          desc: "分享描述", //分享描述
          imgUrl: 'http://img0.imgtn.bdimg.com/it/u=413241571,1035325901&fm=26&gp=0.jpg', // 图片
          desc: '应该还行吧', // 分享描述
          success() {
            opstion.success()
          },
          cancel() {
            opstion.error()
          }
        });
        // 微信sdk错误返回问题
        _this.error(res => {
          alert("出错了：" + res.errMsg); // 这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
        });

      })
      .catch(error => {
        console.log(error);
      });
  }
})
