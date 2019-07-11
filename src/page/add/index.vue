<template>
  <div class="add">
    <div class="add-items">
      <div class="title">活动标题</div>
      <div class="input">
        <input type="text" v-model="temp.title" placeholder="标题在10个字以内"/>
      </div>
    </div>
    <div class="add-items">
      <div class="title">打卡活动说明</div>
      <div class="input">
        <textarea v-model="temp.desc" placeholder="活动说明在100字以内"></textarea>
      </div>
    </div>
    <div class="add-items">
      <div class="title">上传打卡活动封面(选填)</div>
      <div class="input">
        <van-uploader :after-read="onRead">
          <img v-if="temp.images_url" :src="temp.images_url"/>
          <i v-else class="iconfont">&#xe61d;</i>
        </van-uploader>
      </div>
    </div>
    <div class="add-items">
      <div class="title">上传打卡活动图标</div>
      <div class="input y">
        <van-uploader :after-read="onIco">
          <img v-if="temp.ico" :src="temp.ico"/>
          <i v-else class="iconfont">&#xe61d;</i>

        </van-uploader>
      </div>
    </div>

    <div class="list" style="display: none;">
      <audio ref="player" id="audio" src controls></audio>
    </div>
    <div @click="addtheme" style="    height: 30px;
    color: #39bafc;
    font-size: .3rem;">点击添加主题
    </div>
    <van-collapse v-model="activeNames" v-for="(item,index) in theme">
      <van-collapse-item :title='item.day.length==0?"请添加日程内容":item.day' :name="index">
        <div class="add-items">
          <div class="voice">
            <div class="hello">
              <div class="hello-desc">
                <img v-if="item.starttitle==='开始录音'" @click="start(index,item)" src="../../assets/images/start.png"/>
                <img v-if="item.starttitle==='结束录音'" @click="start(index,item)" src="../../assets/images/for.png"/>
                <img v-if="item.starttitle==='开始播放'" @click="start(index,item)" src="../../assets/images/suspen.png"/>
                <img v-if="item.starttitle==='结束播放'" @click="start(index,item)" src="../../assets/images/play.png"/>
                <div style="display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: .2rem;" class="md">
                  <p>录音时间:{{item.time}}</p>
                  <p class="time">点击左侧按钮,{{item.starttitle}}</p>
                </div>
                <!--{{item}}-->


              </div>

              <div class="btndd" @click="again(index)" v-if='item.starttitle=="开始播放"'>重新录音</div>


            </div>
            <div class="add-items" @click="onDay(index)" placeholder="选择">
              {{item.day}}
            </div>
            <div class="add-items">
              <div class="title">签到主题内容</div>
              <div class="input">
                <!--<vue-html5-editor @change="updateData" :content="item.zhuti_desc" :height="500"></vue-html5-editor>-->
                <textarea v-model="item.zhuti_desc" placeholder="写点什么吧～ (500字以内)"></textarea>
              </div>
            </div>

            <div class="btn" @click="handelPost" v-if="edit">提交活动</div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
    <div class="add-desc">
      <div class="title">发起打卡须知</div>
      <lu>
        <li>打卡活动我们将在3天内审核,审核通过后，您可在打卡主页找到自己发起的打卡</li>
        <li>发起成功后,您可将打卡日历详情发送到朋友圈,邀请其他人参与打卡</li>
      </lu>
    </div>

    <div class="editbtn" @click="handelPost" v-show="btnshow" v-if="!edit">提交活动</div>

    <div class="btn" @click="handelPost" v-show="btnshow" v-else>更新主题</div>
    <div class="delbtn" @click="handeldel" v-show="btnshow" v-if="edit">删除</div>
    <van-popup v-model="dayshow" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        @confirm="selDay"
        @cancel="dayshow=false"
      />
    </van-popup>

  </div>
</template>

<script>
  import {getTheme, PostDataByAdd ,GetIdByThemeByDel} from "@api/colck";
  import {upload} from "@api/upload";
  import {InfiniteScroll, Toast} from "mint-ui";
  import Vue from "vue";

  import {quillEditor} from 'vue-quill-editor'


  import { Dialog } from 'vant';

  import {postmateial} from "@api/material";

  import {Uploader} from "vant";


  import wx from "weixin-js-sdk";
  import {getJssdk} from "@api/user";

  import VueHtml5Editor from 'vue-html5-editor'
  Vue.use(VueHtml5Editor);

  const _this = wx;


  Vue.use(Uploader);

  export default {
    name: "add",
    data() {
      return {
        editorOption: {
          modules: {
            toolbar: 'title'
          },
        },

        btnshow: true,
        currentDate: new Date(),
        dayshow: false,
        dayindex: 0,//所选时间
        theme: [],//主题
        activeNames: ['1'],
        temp: {
          images_url: '',
          ico: '',
          type: 1
        },
        desc: "驽马十驾，功在不舍。\n" +
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
        sign: false,
        id: 0,
        detail: {},
        dedd: "",
        tempdata: {
          sum: 0,
        },
        voice: [],
        edit:false,

    };
    },

    filters:{
      daySub(str){
        str.substring(0,9)
      }
    },
    created() {
      let url =
        "http://daka.xiaochendu.com/dist/#";
      this.fullPath = 'http://daka.xiaochendu.com/dist';
      getJssdk(this.fullPath).then(res => {
        let list = res.data;
        this.config = this.$store.state.config

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
          title: this.config.title, // 分享标题
          link: 'http://daka.xiaochendu.com/dist/#/', // 分享链接
          imgUrl: this.config.ico // 图片
        });
        wx.onMenuShareAppMessage({
          title: this.config.title,// 分享标题imgUrl:this.config.ico, // 图片
          desc: this.config.generaltheme, // 分享描述
          link: 'http://daka.xiaochendu.com/dist/#/', // 分享链接
          imgUrl: this.config.ico, // 图片
          success() {
            opstion.success();
          },
          cancel() {
            opstion.error();
          }
        });

      });

      if (this.$route.query.id) {
        this.edit=true
        console.log(this.edit)
        this.getData(this.$route.query.id);
      }
    },
    methods: {
      updateData(e){
        console.log(e)
      },
      onEditorChange({ editor, html, text }){
    console.log(html)
      },
      handeldel(){
        var that=this;
        Dialog.confirm({
          title: '信息确认',
          message: '是否删除主题'
        }).then(() => {

          GetIdByThemeByDel(this.$route.query.id).then(res=>{
            Toast('删除成功');
            this.btnshow = false
            //
            setTimeout(function () {
              that.$router.push({name: "Index"});
            }, 2000);
          })

        }).catch(() => {
          // on cancel
        });

      },
      getData(id) {
        getTheme(id).then(res => {
          console.log(res)
          this.temp = res.data.zhuti
          var data=res.data.theme;
          var arr=[];
          for(let i=0;i<data.length;i++){
            console.log(data[i])
            arr[i]=data[i];
            arr[i].day=data[i].day.substring(0,10)
            arr[i].starttitle='开始播放'
          }
          this.theme=arr
        })
      },
      selDay(e) {
        var d = new Date(e);
        var yeat = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        this.theme[this.dayindex].day = yeat + '-' + month + '-' + day
        this.theme[this.dayindex].name = yeat + '-' + month + '-' + day + '-' + "录音";
        // this.theme[this.dayindex].day=e
        this.dayshow = false;

      },
      onDay(index) {
        this.dayshow = true;
        this.dayindex = index
        console.log(index)
      },
      addtheme() {
        this.theme.push({
          url: '',
          day: '选择日程',
          zhuti_desc: '',
          starttitle: '开始录音',
          time: 0,
        })
      },
      handelPost() {
        var that = this;
        this.temp.user_id = this.$store.state.user_id;
        var posttemp = {
          voice: that.theme,
          temp: this.temp,
        }
        PostDataByAdd(posttemp).then(res => {
          this.btnshow = false
          Toast(res.data.msg);

          setTimeout(function () {
            that.$router.push({name: "Index"});
          }, 2000);
        });
      },
      onRead(file) {
        upload(file).then(res => {
          this.temp.images_url = this.$store.state.url + res.data.path;

        });
      },

      onIco(file) {
        var that = this;
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

      pauseAudio(index) {
        var that = this;
        this.audioPlayShow = true;

        let audio = (this.audio = document.getElementById("audio"));
        that.$refs.player.src = that.theme[index].url;

        that.theme[index].starttitle = "结束播放";
        audio.play();
      },

      stopAudio(index) {
        this.audioPlayShow = false;
        let audio = (this.audio = document.getElementById("audio"));
        this.theme[index].starttitle = "开始播放";
        audio.pause();
      },
      // 开始录音
      start(index, item) {
        let that = this;
        // that.time = 0;
        //默认状态 开始录音
        // 当用户点击开始录音的时候。
        // 状态会变成正在录音。
        // 当正在录音用户点击时那么就是录音结束。
        // 可以进行录音播放
        if (item.starttitle === "结束录音") {
          this.stop(index); //结束录音
          return;
        }
        if (item.starttitle === "开始播放") {

          this.pauseAudio(index);
          return;
        }
        if (item.starttitle === "结束播放") {
          this.stopAudio(index);
          return;
        }
        item.starttitle = "结束录音";
        _this.startRecord({
          success: function () {
            // alert('成功调起录音')
            that.timer = setInterval(() => {
              that.theme[index].time++;
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
      stop(index) {
        let that = this;
        this.theme[index].starttitle = "开始播放";
        _this.stopRecord({
          success: function (res) {
            clearInterval(that.timer);
            that.localId = res.localId;
            that.upVoice(index);
          },
          fail: function (error) {
            // alert('死啦停不了')
          }
        });
      },
      //重新录音
      again(index) {
        let that = this;
        this.theme[index].starttitle = "开始录音";
        _this.stopRecord({
          success: function (res) {
            clearInterval(that.timer);
            that.localId = res.localId;
            that.theme[index].time = 0;
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
      upVoice(index) {
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
            // that.theme[index].url=1;
            postmateial(tmep).then(res => {

              that.temp.voice_url = res.data;
              that.theme[index].url = res.data
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
    watch: {
      temp(data, newdata) {
      }
    },
  };
</script>
<style lang="scss" scoped>
  $background: #fff;
  $color: #39bafc;
  $fontSize: 0.3rem;
  $typecolor: #e4e1e1;

  .add-items > > > .input .van-uploader i {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .add-items > > > .input .van-uploader img {
    width: 200px;
    height: 100px;
  }

  .add-items > > > .van-uploader__wrapper {
    color: black;
  }

  .add-items > > > .input .van-icon-plus:before {
    font-size: 90px;
  }

  .add-items > > > .input .van-uploader {
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


      .y {
        img {
          width: 80px;
          height: 80px;
        }
      }
      .input{
        color: #333;
      }

      .title {
        margin-bottom: 0.3rem;
        height: .5rem;
        line-height: .5rem;
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
    bottom: 60px;
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
  .editbtn {
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

  .delbtn{
    bottom: 10px;
    position: fixed;
    position: fixed;
    width: 87%;

    margin: auto;
    text-align: center;
    background: red;
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

      .hello-desc {
        display: flex;
        flex-direction: row;
      }

      .btndd {
        border: 1px solid #39bafc;
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

  i {
    font-size: 1rem;
  }

  .input > > > .van-uploader {
    border-radius: 4px;
  }

  .md {
    color: #000;
  }
</style>

