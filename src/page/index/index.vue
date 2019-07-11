<template>

  <div style="margin-bottom:40px" >
    <list :MyList="MyList" :mytitle="mytitle" :iconfont="myiconfont"></list>
    <list :MyList="youList"  v-show="admin==1" :mytitle="youtitle" :iconfont="youiconfont"></list>
    <div class="btn"  v-show="admin==1" @click="toAdd">创建打卡》</div>
  </div>
</template>

<script>
import { GetDataByList } from "@api/colck";
import { getDataByUser ,getJssdk} from "@api/user";
import List from "@cmpt/list/";

import wx from "weixin-js-sdk";
const _this = wx;
export default {
  components: {
    List
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20
      },
      show: false,
      youList: [],
      myiconfont: "\ue665",
      youiconfont: "\ue62f",
      mytitle: "我的打卡",
      youtitle: "打卡活动",
      admin: 2,
      MyList: [],
      config:{},
      ico:"",
    };
  },
  computed:{
    watchUser(){
      return this.$store.state.user_id;
    }
  },
  watch:{
    watchUser(user,newuser){
      if(user>0){
        this.show=true
      }

    }

  },

  created() {


    this.fullPath = location.href;
    console.log( this.fullPath)
    this.admin = this.$store.state.userInfo.admin;
    this.listQuery.user_id = this.$route.query.user_id;
    this.getDataList();

    this.fullPath = location.href;
    if (
      this.$route.query.user_id === undefined &&
      this.$store.state.user_id === 0
    ) {
      if (this.$route.query.id !== undefined) {
        window.location.href =
          this.$store.state.url+"/?url=" + this.$route.fullPath;
      } else {
        window.location.href =  this.$store.state.url;
      }
    }
    if (this.$route.query.user_id > 0) {
      getDataByUser(this.$route.query.user_id).then(res => {
        this.$store.state.userInfo = res.data;
        this.$store.state.user_id = res.data.id;
        this.admin =  res.data.admin;

      });

    }
    if (this.$store.state.user_id !== undefined) {
      this.show = true;

    }

    getJssdk(this.fullPath).then(res => {
      let list = res.data;
      this.config= this.$store.state.config
      _this.config({
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
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
          "onMenuShareTimeline",
          "onMenuShareAppMessage"
        ] // 必填，需要使用的JS接口列表
        // 接口 开始录音接口 停止录音接口 播放语音接口 暂停播放接口 停止播放接口 上传语音接口 下载语音接口 识别音频并返回识别结果接口
      });
      // config信息验证后才执行
      _this.ready(() => {
      });
      //朋友圈
      _this.onMenuShareTimeline({
        title:  this.config.title, // 分享标题
        link: 'http://daka.xiaochendu.com/dist/#/', // 分享链接
        imgUrl: this.config.ico // 图片
      });
      //好友
      wx.onMenuShareAppMessage({
        title: this.config.title,// 分享标题imgUrl:this.config.ico, // 图片
        desc: this.config.generaltheme, // 分享描述
        link: 'http://daka.xiaochendu.com/dist/#/', // 分享链接
        imgUrl:this.config.ico, // 图片
        // imgUrl: this.config.ico
        success() {
          opstion.success();
        },
        cancel() {
          opstion.error();
        }
      });
    });

    this.admin= this.$store.state.userInfo.admin
  },

  methods: {
    toAdd() {
      this.$router.push({ name: "Add" });
    },
    getDataList() {
      if (this.listQuery.user_id === undefined) {
        this.listQuery.user_id = this.$store.state.user_id;
      }
      GetDataByList(this.listQuery).then(res => {
        this.MyList = res.data.data.data;
        this.youList = res.data.DataNot.data;
       
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.btn {

  position: fixed;
  bottom: 0px;
  position: fixed;
  width: 100%;
  margin: auto;
  text-align: center;
  background: #fff;
  //   background: #39bafc;
  padding: 10px;
  color: #fff;
  font-size: 0.3rem;
  font-weight: 400;
  border-top: 0.001rem solid rgb(228, 226, 226);
  color: #39bafc;
  height: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  //   border-radius: 1rem;
  //   margin-left: 2%;
}
</style>
