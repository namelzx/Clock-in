<template>
  <div class="main">
    <div class="head-sign" v-if="sign">
      <div class="head-title">每日金句跟读</div>
       <div class="head-main">
         <div class="list-items" v-show="detail.data.get_voice">
            <div class="ico">
              <img :src="detail.data.ico">
            </div>
           <div class="yy"> <audio ref="player"  :src="voiceurl" controls></audio></div>
         </div>
         <div class="list-items" v-show="detail.data.theme">
           <div class="ico">
             <img :src="detail.data.ico">
           </div>
           <div class="yy msdesc" v-html="detail.data.theme">

           </div>
         </div>
       </div>
    </div>

    <div class="add">
      <div class="hello">
      <div class="hello-desc">
        <img v-if="starttitle==='开始录音'" @click="start" src="../../assets/images/start.png"/>
        <img v-if="starttitle==='结束录音'" @click="start" src="../../assets/images/for.png"/>
        <img v-if="starttitle==='开始播放'" @click="start" src="../../assets/images/suspen.png"/>
        <img v-if="starttitle==='结束播放'" @click="start" src="../../assets/images/play.png"/>
        <div style="display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: .2rem;">
          <p>录音时间:{{time}}</p>
          <p>点击左侧按钮,{{starttitle}}</p>
        </div>
        <div class="list" style="display: none;">
          <audio ref="player" id="audio" src controls></audio>
        </div>
      </div>

        <div class="btndd" @click="again" v-if='starttitle=="开始播放"'>重新录音</div>
        <div class="btndd" @click="again" v-if='starttitle=="结束播放"'>重新录音</div>


      </div>
      <div class="add-items">
        <div class="title">签到活动说明</div>
        <div class="input">
          <textarea v-model="temp.desc" placeholder="写点什么吧～ (500字以内)"></textarea>
        </div>
      </div>
      <div class="btn" @click="handelPost">提交活动</div>
    </div>
    <div class="show">
      <van-popup v-model="show">
        <div class="ico">
          <i class="iconfont">&#xe60b;</i>
          <div>签到成功</div>
        </div>
        <div class="desc">恭喜你今日签到成功,累积签到{{tempdata.sum}}天，分享到朋友圈即可完成打卡</div>
        <div class="qdbtn" @click="toPosters">查看成就卡</div>
      </van-popup>
    </div>
  </div>
</template>

<script>
  import {InfiniteScroll, Toast} from "mint-ui";
  import {PostDataByAdd} from "@api/sign";

  import wx from "weixin-js-sdk";
  import {getJssdk} from "@api/user";
  import {postmateial} from "@api/material";

  import {GetIdBydetailed} from "@api/colck";

  const _this = wx;
  export default {
    name: "HelloWorld",
    data() {
      return {
        voiceurl:'',
        desc:"驽马十驾，功在不舍。\n" +
          "坚持是一种信仰! .",
        show: false,
        localId: "",
        serverId: "",
        downLoadId: "",
        Soff: true,
        time: 0,
        starttitle: "开始录音",
        timer: null,
        audioPlayShow: true,
        temp: {
          desc: "",
        },
        sign:false,
        id: 0,
        detail:{},
        dedd:"",
        tempdata: {
          sum: 0,
        }
      };
    },
    created() {
      let url =
        "http://daka.xiaochendu.com/dist/#" +
        this.$route.path +
        "?id=" +
        this.$route.query.id;
      this.fullPath = 'http://daka.xiaochendu.com/dist';
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
        _this.ready(() => {
        });
        _this.error(res => {
          alert("出错了：" + res.errMsg); // 这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
        });
        _this.onMenuShareTimeline({
          title: "现在我这个是分享到朋友圈1", // 分享标题
          desc: "我这个就是一个简单的分享朋友圈描述", //分享描述
          link: url, // 分享链接
          imgUrl: "https://pwmapi.oss-cn-beijing.aliyuncs.com/bj.jpeg" // 图片
        });
        wx.onMenuShareAppMessage({
          title: "我觉得我这个是分享到好友", // 分享标题
          desc: "我这个就是一个简单的分享好友描述", //分享描述
          link: url,
          imgUrl: "https://pwmapi.oss-cn-beijing.aliyuncs.com/bj.jpeg", // 图片
          success() {
            opstion.success();
          },
          cancel() {
            opstion.error();
          }
        });

      });

      this.id = this.$route.params.id;

      var tmep = {
        id: this.id,
        user_id: this.$store.state.user_id
      }
      GetIdBydetailed(tmep).then(res => {
        this.detail = res.data

        var temp=res.data.data

        if(temp.get_voice!==undefined&&temp.theme!==undefined){
          this.sign=true
          this.voiceurl=temp.get_voice.url
        }
      })

    },
    methods: {
      toPosters() {
        var that = this;
        that.$router.push({
          path: "/Posters",
          query: {
            id: that.id
          }
        });
      },
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
        if (this.temp.desc.length < 3) {
          Toast('随便说点什么吧');
          return false;
        }
        PostDataByAdd(this.temp).then(res => {
          // Toast(res.data.msg);
          var tmep = {
            id: this.id,
            user_id: this.$store.state.user_id
          }
          GetIdBydetailed(tmep).then(res => {
            this.tempdata = res.data
          })
          this.show = true;
        });
      },

      pauseAudio() {
        this.audioPlayShow = true;
        let audio = (this.audio = document.getElementById("audio"));
        this.starttitle = "结束播放";
        audio.play();
      },

      stopAudio() {
        this.audioPlayShow = false;
        let audio = (this.audio = document.getElementById("audio"));
        this.starttitle = "开始播放";
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
        if (this.starttitle === "结束录音") {
          this.stop(); //结束录音
          return;
        }
        if (this.starttitle === "开始播放") {
          this.pauseAudio();
          return;
        }
        if (this.starttitle === "结束播放") {
          this.stopAudio();
          return;
        }

        this.starttitle = "结束录音";
        _this.startRecord({
          success: function () {
            // alert('成功调起录音')
            that.timer = setInterval(() => {
              that.time++;
              // alert('开始');
            }, 1000);
            that.vicoeEnd();
          },
          cancel: function () {
            alert("用户拒绝授权录音");
          }
        });
      },
      // 停止录音
      stop() {
        let that = this;
        this.starttitle = "开始播放";
        _this.stopRecord({
          success: function (res) {
            clearInterval(that.timer);
            that.localId = res.localId;
            that.upVoice();
          },
          fail: function (error) {
            // alert('死啦停不了')
            console.log(error);
          }
        });
      },
      //重新录音
      again(){
        let that = this;
        this.starttitle = "开始录音";
        _this.stopRecord({
          success: function (res) {
            clearInterval(that.timer);
            that.localId = res.localId;
            that.time=0;
          },
          fail: function (error) {
            // alert('死啦停不了')
            console.log(error);
          }
        });
      },
      // 取消录音
      cancel() {
        _this.stopRecord({
          success: res => {
          }
        });
      },
      // 60秒监听
      vicoeEnd() {
        let that = this;
        _this.onVoiceRecordEnd({
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: function (res) {
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
          headers: {"Content-Type": "application/json"},
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
          success: function (res) {
            var apiUrl = window.location.href;
            that.serverId = res.serverId; // 返回音频的服务器端ID

            var tmep = {
              serverId: res.serverId,
              url: apiUrl
            };
            postmateial(tmep).then(res => {
              that.$refs.player.src = res.data;
              that.temp.voice_url = res.data;
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
          success: function (res) {
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
          headers: {"Content-Type": "application/json"},
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
.main{
  background: #fafafa;
}

  .head-sign{
    display: flex;
    flex-direction: column;
    padding: 0.3rem;
    background: #fff;
    margin-bottom: 10px;
    .head-title{
      color: $color;
    }
    .head-main {
      padding: 0.3rem;
      display: flex;
      flex-direction: column;
      background: #fff;
      .list-items {
        display: flex;
        flex-direction: row;
        margin-top: 10px;
        .ico{
          margin-right: .3rem;

        }
        .msdesc{
          border: 1px solid #aaa;
          border-radius: 3px;
          padding: 10px;
          width: 100%;
        }
        img {
          width: 40px;
          height: 40px;
          border-radius: 100%;
        }
      }
    }


  }
  .add {
    background: $background;
    padding: 0.3rem;


    .hello {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .hello-desc{
        display: flex;
        flex-direction: row;
      }
      .btndd{
        border:1px solid #39bafc;
        border-radius: 30px;
        padding: 2px;
        padding-left: 10px;
        padding-right: 10px;
        color: #39bafc;
        font-size: 12px;
      }

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
        padding-top: 0.1rem;
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
        font-size: 0.3rem;
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

  .show > > > .van-popup {
    min-height: 100px;
    min-width: 300px;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .show > > > .van-popup .ico .iconfont {
    color: #39bafc;
    font-weight: 800;
    font-size: 0.9rem;
  }

  .show > > > .van-popup .ico {
    font-size: 0.4rem;
    text-align: center;
  }

  .show {
    .desc {
      font-size: 0.3rem;
      color: rgb(134, 134, 134);
      padding: 20px;
      margin-bottom: 1rem;
    }

    .qdbtn {
      bottom: 10px;
      position: fixed;
      position: fixed;
      width: 87%;
      margin: auto;
      text-align: center;
      background: #fdce2f;
      padding: 10px;
      color: #654312;
      font-size: 0.3rem;
      font-weight: 800;
      border-radius: 1rem;
    }
  }
</style>



