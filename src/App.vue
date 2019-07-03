<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { getDataByUser } from "@api/user";


import wx from "weixin-js-sdk";
import { getJssdk } from "@api/user";
export default {
  name: "App",
  mounted(){
     this.fullPath=window.location.href
    
    this.id = this.$route.params.id;
    getJssdk(   this.fullPath)
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
            "downloadVoice"
          ] // 必填，需要使用的JS接口列表
          // 接口 开始录音接口 停止录音接口 播放语音接口 暂停播放接口 停止播放接口 上传语音接口 下载语音接口 识别音频并返回识别结果接口
        });
        // config信息验证后才执行
        _this.ready(() => {});
        // 微信sdk错误返回问题
        _this.error(res => {
          alert("出错了：" + res.errMsg); // 这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  height: 100%;
  color: #2c3e50;
  font-size: 0.26rem;
}
</style>
