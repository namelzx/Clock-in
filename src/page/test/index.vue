<template>
  <div>
    <div class="add">
      <div class="hello">
        <img v-if="starttitle==='开始录音'" @click="start" src="../../assets/images/start.png" />
        <img v-if="starttitle==='正在录音'" @click="start" src="../../assets/images/for.png" />
        <img v-if="starttitle==='录音结束'" @click="start" src="../../assets/images/suspen.png" />
        <img v-if="starttitle==='录音播放中'" @click="start" src="../../assets/images/play.png" />
        <div style="display: flex;
    flex-direction: column;
    justify-content: center;">
          <p>录音时间{{time}}</p>
          <p>当前{{starttitle}}</p>
        </div>
        <div class="list" style="display: none;">
          <audio ref="player" id="audio" src controls></audio>
        </div>
      </div>
      <div class="add-items">
        <div class="title">签到活动说明</div>
        <div class="input">
          <textarea v-model="temp.desc" placeholder="写点什么吧～ (500字以内)"></textarea>
        </div>
      </div>
      <div class="btn" @click="handelPost">提交活动</div>
    </div>
  </div>
</template>

<script>
import { Toast, InfiniteScroll } from "mint-ui";
import { PostDataByAdd } from "@api/sign";

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
      audioPlayShow: true,
      temp: {},
      id: 0
    };
  },
  created() {
     this.fullPath=window.location.href
    
    this.id = this.$route.params.id;
    // getJssdk(   this.fullPath)
    //   .then(res => {
    //     // console.log(res)
    //     let list = res.data;
    //     _this.config({
    //       appId: list.appId, // 必填，公众号的唯一标识
    //       timestamp: list.timestamp, // 必填，生成签名的时间戳
    //       nonceStr: list.nonceStr, // 必填，生成签名的随机串
    //       signature: list.signature, // 必填，签名
    //       jsApiList: [
    //         "startRecord",
    //         "translateVoice",
    //         "stopRecord",
    //         "playVoice",
    //         "pauseVoice",
    //         "stopVoice",
    //         "uploadVoice",
    //         "downloadVoice",
    //         "downloadVoice"
    //       ] // 必填，需要使用的JS接口列表
    //       // 接口 开始录音接口 停止录音接口 播放语音接口 暂停播放接口 停止播放接口 上传语音接口 下载语音接口 识别音频并返回识别结果接口
    //     });
    //     // config信息验证后才执行
    //     _this.ready(() => {});
    //     // 微信sdk错误返回问题
    //     _this.error(res => {
    //       alert("出错了：" + res.errMsg); // 这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
    //     });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  },
  methods: {
    handelPost() {
      var that = this;
      this.temp.user_id = this.$store.state.user_id;
      this.temp.zhuti_id = this.id;
      let date = new Date();
      this.temp.days =
        date.getFullYear() +
        "-" +
        parseInt(date.getMonth() + 1) +
        "-" +
        date.getDate();
      PostDataByAdd(this.temp).then(res => {
        Toast(res.data.msg);
        setTimeout(function() {
          that.$router.push({
            path: "/detailed",
            query: {
              id: that.id
            }
          });
        }, 2000);
      });
    },

    pauseAudio() {
      this.audioPlayShow = true;
      let audio = (this.audio = document.getElementById("audio"));
      this.starttitle = "录音播放中";
      console.log("播放中");
      audio.play();
    },

    stopAudio() {
      this.audioPlayShow = false;
      let audio = (this.audio = document.getElementById("audio"));
      this.starttitle = "录音结束";
      audio.pause();
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
        this.stop(); //结束录音
        return;
      }
      if (this.starttitle === "录音结束") {
        this.pauseAudio();
        return;
      }
      if (this.starttitle === "录音播放中") {
        this.stopAudio();
        return;
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
      this.starttitle = "录音结束";
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
            that.temp.voice_url=res.data;
          });
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


<style lang="scss" scoped>
$background: #fff;
$color: #39bafc;
$fontSize: 0.25rem;
$typecolor: #e4e1e1;

.add {
  background: $background;
  margin: 0.3rem;
  .hello {
    display: flex;
    flex-direction: row;
    img {
      width: 1rem;
      height: 1rem;
    }
  }
  .add-items {
    display: flex;
    flex-direction: column;
    color: $color;
    font-size: $fontSize;
    margin-bottom: 0.4rem;
    .title {
      margin-bottom: 0.1rem;
    }
    input {
      width: 100%;
      height: 0.5rem;
      border-bottom: 1px solid $typecolor;
    }
    textarea {
       text-indent: 0.3rem;
       padding-top: .1rem;
       color: black;
      width: 100%;
      height: 1.5rem;
      border: 1px solid $typecolor;
      border-radius: 0.1rem;
    }
    ::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: #aaa;
      text-indent: 0.3rem;
      padding-top: 0.1rem;
      font-size: 0.2rem;
    }
  }
}
.btn {
  bottom: 10px;
  position: fixed;
  position: fixed;
  width: 87%;
  margin: auto;
  text-align: center;
  background: #39bafc;
  padding: 10px;
  color: #fff;
  font-size: 0.3rem;
  font-weight: 800;
  border-radius: 1rem;
}
</style>



