<template>
  <div class="add">
    <div class="add-items">
      <div class="title">活动标题</div>
      <div class="input">
        <input type="text" v-model="temp.title" placeholder="标题在10个字以内" />
      </div>
    </div>
    <div class="add-items">
      <div class="title">打卡活动说明</div>
      <div class="input">
        <textarea v-model="temp.desc" placeholder="活动说明在100字以内"></textarea>
      </div>
    </div>
    <div class="add-items">

      <div class="voice">
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
            <textarea v-model="temp.theme" placeholder="写点什么吧～ (500字以内)"></textarea>
          </div>
        </div>
        <div class="btn" @click="handelPost">提交活动</div>
      </div>
    </div>
    <div class="add-items">
      <div class="title">上传打卡活动封面(选填)</div>
      <div class="input">
        <van-uploader :after-read="onRead">
          <img v-if="temp.images_url" :src="temp.images_url" />
          <van-icon v-else name="plus" />
        </van-uploader>
      </div>
    </div>

    <div class="add-items">
      <div class="title">上传打卡活动图标</div>
      <div class="input y">
        <van-uploader :after-read="onIco">
          <img v-if="temp.ico" :src="temp.ico" />
          <van-icon v-else name="plus" />
        </van-uploader>
      </div>
    </div>

    <div class="add-desc">
      <div class="title">发起打卡须知</div>
      <lu>
        <li>打卡活动我们将在3天内审核,审核通过后，您可在打卡主页找到自己发起的打卡</li>
        <li>发起成功后,您可将打卡日历详情发送到朋友圈,邀请其他人参与打卡</li>
      </lu>
    </div>

    <div class="btn" @click="handelPost">提交活动</div>
  </div>
</template>

<script>
  import { PostDataByAdd } from "@api/colck";
  import { upload } from "@api/upload";

  import HZRecorder from "@util/HZRecorder";
  import { Toast, InfiniteScroll } from "mint-ui";
  import Vue from "vue";

  import {postmateial} from "@api/material";

  import { Uploader } from "vant";


  import wx from "weixin-js-sdk";
  import {getJssdk} from "@api/user";
  const _this = wx;


  Vue.use(Uploader);

  export default {
    name:"add",
    data() {
      return {
        temp: {
          images_url : '',
          ico:'',
          type: 1
        },
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
        sign:false,
        id: 0,
        detail:{},
        dedd:"",
        tempdata: {
          sum: 0,
        },
        voice:[],
      };
    },

    created(){
      let url =
        "http://daka.xiaochendu.com/dist/#";
      this.fullPath = 'http://daka.xiaochendu.com/dist';
      getJssdk(this.fullPath).then(res => {
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
    },
    methods: {
      handelPost() {
        var that = this;
        this.temp.user_id = this.$store.state.user_id;
        var posttemp={
          voice:that.voice,
          temp:this.temp
        }
        PostDataByAdd(posttemp).then(res => {

          Toast('创建成功');
          setTimeout(function() {
            that.$router.push({ name: "Index" });
          }, 2000);
        });
      },
      onRead(file) {
        upload(file).then(res => {
          this.temp.images_url = this.$store.state.url + res.data.path;

        });
      },

      onIco(file) {
        var that=this;
        upload(file).then(res => {

          this.temp.ico = this.$store.state.url + res.data.path;

        });
      },


      toPosters() {
        var that = this;
        that.$router.push({
          path: "/Posters",
          query: {
            id: that.id
          }
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
            that.$refs.allRecord.src = ser.data;
          })
          .catch(error => {
          });
      },
      // 播放
      play() {
        let that = this;
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
              var myDate = new Date();
              var temp={
                name:myDate.getMonth()+'-'+myDate.getDate()+''+'录音',
                url:res.data,
               time_len:that.time
              }
              that.voice.push(temp)
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
            this.$refs.player.src = res.data;
          })
          .catch(error => {
          });
      }
    },
    watch:{
      temp(data,newdata){
      }
    },
  };
</script>
<style lang="scss" scoped>
  $background: #fff;
  $color: #39bafc;
  $fontSize: 0.3rem;
  $typecolor: #e4e1e1;

  .add-items >>> .input .van-uploader i {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .add-items >>> .input .van-uploader img {
    width: 200px;
    height: 100px;
  }
  .add-items >>> .van-uploader__wrapper {
    color: black;
  }
  .add-items >>> .input .van-icon-plus:before {
    font-size: 90px;
  }
  .add-items >>> .input .van-uploader {
    border: 1px solid $typecolor;
    color: $typecolor;
  }
  .add {

    background: $background;
    margin: 0.3rem;
    .add-items {
      display: flex;
      flex-direction: column;
      color: $color;
      font-size: $fontSize;
      margin-bottom: 0.4rem;
      .y{
        img{
          width: 80px;
          height: 80px;
        }
      }
      .title {
        margin-bottom: 0.3rem;
      }
      input {
        width: 100%;
        height: 0.8rem;
        line-height: .8rem;
        border-bottom: 1px solid $typecolor;
        text-indent: 0.3rem;
        padding-top: 0.1rem;
        font-size: 0.3rem;
        color: black;
      }
      textarea {
        width: 100%;
        height: 1.5rem;
        border: 1px solid $typecolor;
        border-radius: 0.1rem;
        color: black;
        text-indent: 0.3rem;
        padding-top: 0.1rem;
        font-size: 0.3rem;
        resize: none;
      }
      ::-webkit-input-placeholder {
        /* Chrome/Opera/Safari */
        color: #aaa;
        text-indent: 0.3rem;
        padding-top: 0.1rem;
        font-size: 0.3rem;
      }
    }
    .add-desc {
      display: flex;
      flex-direction: column;
      padding-bottom: 3rem;
      margin-top: 10px;
      .title {
        border-left: 4px solid #aaa;
        text-indent: 0.2rem;
      }
      lu {
        li {
          padding-top: 0.5rem;
          color: #aaa;
        }
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
  .voice {
    background: $background;
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

</style>

