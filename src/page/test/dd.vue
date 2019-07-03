<template>
  <div class="hello">
      <img  src=""/>
    <button class="record" @click="start">{{starttitle}}</button>
    <button @click="stop">停止录音</button>
    <button @click="cancel">取消录音</button>
    <button @click="downVoice">下载录音</button>
    <br/>
    <p>录音时间{{time}}</p>
    <div class="list">
      刚录完的语言
      <audio ref="player" id="audio" src="http://clock.10huisp.com/uploads/voice/1561981551.mp3" controls></audio>
      <!-- ./status/uploads/record/cplZxG7oYspQxopQIb9g_cUJ7Y69htn_ybzFiRZR_U3Vf8Bv4Nh6D6TBPWa5VmGs.mp3 -->
    </div>

    <!-- 播放 -->
<div class="play" v-if="audioPlayShow" @click="pauseAudio">
     <button >播放</button>
</div>
<!-- 暂停-->
<div class="play" v-else>
  <button @click="pauseAudio">暂停</button>
</div>

    <br />
    <br />
    <div>
      <button @click="merge">合并所有录音</button>
      <audio ref="allRecord" src controls></audio>
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import { getJssdk } from "@api/user";
import { postmateial } from "@api/material";
const _this = wx;
export default {
  name: "HelloWorld",
  data() {
    return {
      localId: "",
      serverId: "",
      downLoadId: "",
      Soff: true,
      time: 0,
      starttitle: "开始录音",
      timer: null,
      audioPlayShow:true,
    };
  },
  created() {
    console.log(11);
    // let apiUrl = 'http://clock.10huisp.com/dist/#/test';
    getJssdk()
      .then(res => {
        // console.log(res)
        let list = res.data;
        _this.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
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
  },
  methods: {
  
    pauseAudio(){
        this.audioPlayShow = true;
      let audio = (this.audio = document.getElementById("audio"));
      this.starttitle="播放录音"
      audio.play();
    },
    // 开始录音
    start(e) {
      let that = this;
      // that.time = 0;
      //默认状态 开始录音 
      // 当用户点击开始录音的时候。
      // 状态会变成正在录音。
      // 当正在录音用户点击时那么就是录音结束。
      // 可以进行录音播放
      if (this.starttitle === "正在录音") {
        this.stop();
        return;
      }
      if(this.starttitle==='播放录音'){
        this.pauseAudio();
        return ;
      }
      
      this.starttitle = "正在录音";
      _this.startRecord({
        success: function() {
          // alert('成功调起录音')
          that.timer = setInterval(() => {
            that.time++;
            // alert('开始');
          }, 1000);
          that.vicoeEnd();
        },
        cancel: function() {
          alert("用户拒绝授权录音");
        }
      });
    },
    // 停止录音
    stop() {
      let that = this;
      this.starttitle = "播放录音";
      _this.stopRecord({
        success: function(res) {
          clearInterval(that.timer);
          that.localId = res.localId;
          that.upVoice();
        },
        fail: function(error) {
          // alert('死啦停不了')
          console.log(error);
        }
      });
    },
    // 取消录音
    cancel() {
      _this.stopRecord({
        success: res => {}
      });
    },
    // 60秒监听
    vicoeEnd() {
      let that = this;
      _this.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: function(res) {
          alert("60秒停止录音");
          that.localId = res.localId;
          clearInterval(that.timer);
          that.upVoice();
        }
      });
    },
    // 合并
    merge() {
      let that = this;
      var apiUrl = window.location.href;
      this.axios({
        method: "post",
        url: "http://apiwx.lostars.cn/index.php/index/File/merge",
        headers: { "Content-Type": "application/json" },
        data: {
          url: apiUrl
        }
      })
        .then(ser => {
          console.log(ser);
          that.$refs.allRecord.src = ser.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 播放
    play() {
      let that = this;
      console.log(that.localId);
      _this.playVoice({
        localId: "" // 需要播放的音频的本地ID，由stopRecord接口获得
      });
    },
    // 暂停
    pausePlay() {
      let that = this;
      _this.pauseVoice({
        localId: that.localId // 需要暂停的音频的本地ID，由stopRecord接口获得
      });
    },
    // 停止
    stopPlay() {
      let that = this;
      _this.stopVoice({
        localId: that.localId // 需要停止的音频的本地ID，由stopRecord接口获得
      });
    },
    // 上传语音
    upVoice() {
      let that = this;
      _this.uploadVoice({
        localId: that.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          var apiUrl = window.location.href;
          that.serverId = res.serverId; // 返回音频的服务器端ID
          // console.log(res)
          // return false;
          var tmep = {
            serverId: res.serverId,
            url: apiUrl
          };
          postmateial(tmep).then(res => {
            that.$refs.player.src = res.data;
            // data.data
          });
          //  that.axios({
          //       method: 'post',
          //       url: 'api',
          //       headers: {'Content-Type': 'application/json'},
          //       data: {
          //         serverId: res.serverId,
          //         url: apiUrl
          //       }
          //     })
          //       .then((data) => {
          //         console.log(data)
          //         that.$refs.player.src = data.data
          //       })
          //       .catch((error) => {
          //         console.log(error)
          //       })
        }
      });
    },
    // 下载语音
    downVoice() {
      let that = this;
      _this.downloadVoice({
        serverId: that.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          alert("下载成功");
          that.downLoadId = res.localId; // 返回音频的本地ID
          console.log(res);
          console.log(that.downLoadId);
        }
      });
    },
    // 模拟上传语音
    fake() {
      var apiUrl = window.location.href;
      this.axios({
        method: "post",
        url: "api",
        headers: { "Content-Type": "application/json" },
        data: {
          serverId:
            "cplZxG7oYspQxopQIb9g_cUJ7Y69htn_ybzFiRZR_U3Vf8Bv4Nh6D6TBPWa5VmGs",
          url: apiUrl
        }
      })
        .then(res => {
          console.log(res);
          this.$refs.player.src = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
