<template>
  <div>
    <div class="detailed" >
      <header :style="back">
        <div class="header-top">
          <div class="images">
            <img :src="detailed.ico" />
          </div>
          <div class="desc">
            <div class="title">{{detailed.title}}</div>
            <div class="info">{{sumZhuti}}人参与 | {{sumsign}}人打卡</div>
            <div class="info-desc">{{detailed.desc}}</div>
          </div>
        </div>
      </header>
      <weeks :markArr="markAll" :id="id" @sendiptVal="showChildMsg"></weeks>
      <card :theme="get_theme" :desc="detailed.zhuti_desc" :voice="detailed.get_voice"></card>
      <sign
        :title="sign"
        :userInfo="userInfo"
        :list="markArr"
        :sum="sum"
        :continuousday="continuousday"
      ></sign>
    </div>
    <div class="tdbtn" @click="toUrl">立即跟读</div>

    <!--<div class="btn" @click="UnsuDelete">退订</div>-->

  </div>
</template>

<script>
import weeks from "@cmpt/calender/weeks";

import card from "@cmpt/card";

import sign from "@cmpt/sign";

import { GetIdBydetailed, GetIdByUnsuDelete } from "@api/colck";
import { Toast } from "vant";
import { getDataByUser } from "@api/user";

import wx from "weixin-js-sdk";
import { getJssdk } from "@api/user";
const _this = wx;
export default {
  components: {
    weeks,
    card,
    sign
  },
  data() {
    return {
      edit:false,
      get_theme:{},
      show: false,
      id: 0,
      desc: "111",
      detailed: {},
      list: [],
      temp: {
        id: undefined,
        days: undefined
      },
      config:{},
      continuousday: 0,
      sum: 0,
      userInfo: {},
      sign: "签到记录",
      markArr: [],
      markAll: [],
      fullPath: "",
      sumsign:0,
      sumZhuti:0,
      detailes: {
        tx:
          "https://img.zcool.cn/community/011cff5c7e3893a801213f26f4fed1.jpg@1280w_1l_2o_100sh.jpg"
      },
      back:
        "background: url(https://img.zcool.cn/community/0160265b568b19a80121ade064d92a.jpg@1280w_1l_2o_100sh.jpg);"
    };
  },
  created() {

   this.config= this.$store.state.config

    let url =
      "http://daka.xiaochendu.com/dist/#" +
      this.$route.path +
      "?id=" +
      this.$route.query.id;
    this.fullPath = location.href;

    if (
      this.$route.query.user_id === undefined &&
      this.$store.state.user_id === 0
    ) {
      this.fullPath =
        this.$store.state.url+"/dist/#" +
        this.$route.path +
        "?id=" +
        this.$route.query.id;
    }
    if (
      this.$route.query.id !== undefined &&
      this.$route.query.user_id === undefined &&
      this.$store.state.user_id === 0
    ) {
      this.fullPath =
        this.$store.state.url+"/dist/#" +
        this.$route.path +
        "?id=" +
        this.$route.query.id;
    }


    this.getData();
    getJssdk(this.fullPath).then(res => {
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
          "onMenuShareTimeline",
          "onMenuShareAppMessage"
        ] // 必填，需要使用的JS接口列表
        // 接口 开始录音接口 停止录音接口 播放语音接口 暂停播放接口 停止播放接口 上传语音接口 下载语音接口 识别音频并返回识别结果接口
      });
      // config信息验证后才执行
      _this.ready(() => {});
      _this.error(res => {
        alert("出错了：" + res.errMsg); // 这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
      });
      _this.onMenuShareTimeline({
        title: this.detailed.title, // 分享标题
        desc:  this.detailed.title+this.config.theme, //分享描述
        link: url, // 分享链接
        imgUrl: this.detailed.ico // 图片
      });
      wx.onMenuShareAppMessage({
        title: this.detailed.title, // 分享标题
        desc:  this.detailed.title+this.config.theme, //分享描述
        link: url,
        imgUrl:this.detailed.ico, // 图片
        success() {
          // opstion.success();
        },
        cancel() {
          // opstion.error();
        }
      });

    });

    this.userInfo = this.$store.state.userInfo;

    // console.log()
    this.id = this.$route.query.id;
    this.temp.id = this.id;
    if (this.$route.query.days) {
      this.temp.days = this.$route.query.days;
    }
  },

  methods: {
    getData() {
      var that=this;
      this.temp.user_id = this.$store.state.user_id;
      if (this.$route.query.user_id > 0) {
        getDataByUser(this.$route.query.user_id).then(res => {
          this.$store.state.userInfo = res.data;
          this.$store.state.user_id = res.data.id;
          this.userInfo = res.data;
        });
        this.temp.user_id = this.$route.query.user_id;
      }
      GetIdBydetailed(this.temp).then(res => {
        this.detailed = res.data.data;
        if(this.detailed.images_url!==undefined){
          this.back='background: url('+this.detailed.images_url+') no-repeat;    background-size:100%100%;\n'
        }
        this.markArr = res.data.data.get_sign;
        this.markAll = res.data.data.get_signall;
        this.sum = res.data.sum;
        this.sumsign=res.data.sumsign;
        this.sumZhuti=res.data.sumZhuti;
        this.desc = this.detailed.desc;
        this.get_theme=this.detailed.get_theme
        this.continuousday = res.data.continuousday;
        console.log(this.detailed.get_theme)
        if(this.detailed.get_theme===null){
          this.get_theme={};
        }

        Toast.clear();

      });
    },
    showChildMsg(temp) {
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      this.temp = temp;
      this.getData();
    },
    toUrl() {
      this.$router.push({ name: "test", params: { id: this.id } });
    },
    UnsuDelete() {
      var temp = {
        zhuti_id: this.id,
        user_id: this.$store.state.user_id
      };
      if (this.$store.state.userInfo.id === this.detailed.user_id) {
        Toast("不能退订自己建立的主题");
        return;
      }
      GetIdByUnsuDelete(temp).then(res => {
        this.$router.push({ path: "/" });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$fontSize: 12px;
$fontColor: #f2f2f2;
.detailed {
  // height: 100%;
  font-size: $fontSize;
  background: $fontColor;
  header {
    height: 3.5rem;
    .header-top {
      display: flex;
      flex-direction: row;
      padding-top: 0.5rem;
      padding-left: 0.8rem;
      color: #fff;
      // align-items: center;
      img {
        width: 1rem;
        height: 1rem;
        border-radius: 100%;
      }
      .desc {
        font-weight: 500;
        font-size: 0.4rem;
        padding-left: 0.3rem;
        .info {
          font-weight: 400;
          font-size: 0.3rem;
        }
        .info-desc {
          padding-top: 0.5rem;
          font-size: 0.25rem;
          font-weight: 400;
          color: #e0e0e0;
          width: 90%;
        }
      }
    }
  }
}
.btn {
  bottom: 10px;
  position: fixed;
  bottom: 10px;
  position: fixed;
  width: 8%;
  margin: auto;
  text-align: center;
  background: #39bafc;
  padding: 10px;
  color: #fff;
  font-size: 0.3rem;
  font-weight: 800;
  border-radius: 1rem;
  margin-left: 80%;
}
.tdbtn {
  /*position: fixed;*/
  /*bottom: 1.5rem;*/
  /*position: fixed;*/
  /*width: 100%;*/
  /*margin: auto;*/
  /*text-align: center;*/
  /*background: #39bafc;*/
  /*padding: 10px;*/
  /*color: #fff;*/
  /*font-size: 0.3rem;*/
  /*font-weight: 800;*/
  /*border-radius: 1rem;*/
  /*margin-left: 80%;*/
  position: fixed;
  bottom: .2rem;
  position: fixed;
  width: 90%;
  margin: auto;
  text-align: center;
  background: #39bafc;
  padding: 10px;
  color: #fff;
  font-size: 0.3rem;
  font-weight: 800;
  border-radius: 1rem;
  margin: auto;
  margin-left: 2%;
}
</style>

