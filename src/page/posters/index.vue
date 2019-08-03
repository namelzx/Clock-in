<template>
  <div class="main">
    <div class="show">

      <van-popup v-model="qdshow">
        <div class="ico">
          <i class="iconfont">&#xe60b;</i>
          <div>打卡成功</div>
        </div>
        <div class="desc">恭喜你打卡成功,你可以通过日历查看每天签到状态</div>
        <div class="qdbtn" @click="qdshow=false" >确定</div>
      </van-popup>
    </div>
    <div id="imgBox">

      <p>长按图片保存到系统相册中然后分享</p>
      <img :src="imgSrc" v-if="imgSrc"/>

    </div>
    <van-popup v-model="pushow" @click="pushow=false">

      <img src="https://kedand.oss-cn-beijing.aliyuncs.com/punch.png">
    </van-popup>

    <div class="btn" @click="pushow=true" >立即打卡</div>
  </div>
</template>

<script>
  import Vue from 'vue'

  // import html2canvas from "html2canvas";

  // import QRcode from "@xkeshi/vue-qrcode";

  import {GetIdBydetailed,postPunch} from "@api/colck";

  import wx from "weixin-js-sdk";
  import { getJssdk } from "@api/user";
  const _this = wx;
  import { Popup } from 'vant';

  Vue.use(Popup);
  export default {
    data() {
      return {
        qdshow:false,
        temp: {
          continuousday: 0,
          sum: 0,
          data: {
            title: ""
          }
        },
        pushow:false,
        userName: "千里草", //用户称呢
        imgSrc: "", //合成最终图片
        fm: "",//封面图
        ci: "",
        avater:
          "../../assets/images/1562262260.png",
        qrCode:
          "http://img0.imgtn.bdimg.com/it/u=413241571,1035325901&fm=26&gp=0.jpg" //二维码
      };
    },

    created() {
       var that=this;

      let url =
        "http://daka.xiaochendu.com/dist/#/detailed/" +
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


      getJssdk(this.fullPath).then(res => {
        // console.log(res)
      var detailed= this.$store.state.config;
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
          console.log('回调')
        });
        _this.error(res => {
          alert("出错了：" + res.errMsg); // 这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
        });
        _this.onMenuShareTimeline({
          title: detailed.title, // 分享标题
          desc:  detailed.title+detailed.theme, //分享描述
          link: url, // 分享链接
          imgUrl:detailed.ico, // 图片
          success() {

            that.pushow=false
            that.qdshow=true
            that.Punch()
            console.log('好友回调')
            // opstion.success();
          },
          cancel() {

            this.pushow=false
            console.log('取消好友回调')

          }
        });
        wx.onMenuShareAppMessage({
          title: detailed.title, // 分享标题
          desc:  detailed.title+detailed.theme, //分享描述
          link: url,
          imgUrl:detailed.ico, // 图片
          success() {
            that.pushow=false
            that.qdshow=true
            that.Punch()
            // opstion.success();
          },
          cancel() {
            this.pushow=false
            console.log('取消好友回调')

            // opstion.error();
          }
        });

      });


      var temp = {
        id: this.$route.query.id,
        user_id: this.$store.state.user_id,
      }
      if (this.$route.query.user_id != undefined) {
        temp.user_id = this.$route.query.user_id
      }
      GetIdBydetailed(temp).then(res => {
        this.temp = res.data


        if(res.data.data.get_sules===null){
          this.fm='http://daka.xiaochendu.com/uploads/20190706/20c11258e303a8de3b0dd2f4e59a4fc5.jpeg';
          this.ci='骐骥一跃，不能十步;驽马十驾，功在不舍。坚持是一种信仰! ';
          this.drawCanvasBgImg();
          console.log('没有封面')
          return ;
        }
        var sules = res.data.data.get_sules
        for (let i = 0; i < sules.length; i++) {
          if (sules[i].day >= this.temp.sum) {
            this.fm = sules[i].images_url;
            this.ci = sules[i].ci
            this.drawCanvasBgImg();
            return;
          }
          if (sules[i].day < this.temp.sum) {
            this.fm = sules[i].images_url;
            this.ci = sules[i].ci
            this.drawCanvasBgImg();
            return;
          }
        }
      })
    },

    methods: {
      Punch(){
        var temp = {
          zhuti_id: this.$route.query.id,
          user_id: this.$store.state.user_id,
        }
        postPunch(temp).then(res=>{
          console.log(res)

        })
      },
      // 获取页面dpr和宽度
      getWindowInfo() {
        var windowInfo = {};
        windowInfo.dpr = window.devicePixelRatio;
        if (window.innerWidth) {
          windowInfo.width = window.innerWidth;
        } else {
          windowInfo.width = document.body.clientWidth;
        }
        return windowInfo;
      },
      //拿到数据后开始画背景大图 想法很简单就是把图片画到canvas中然后在画布上再画头像文字让后转成img
      drawCanvasBgImg() {
        var vm = this;
        var canvas = document.createElement("canvas");

        var ctx = canvas.getContext("2d");
        var clientWidth = this.getWindowInfo().width; //获取屏幕宽度用于canvas宽度自适应移动端屏幕
        var dpr = this.getWindowInfo().dpr;

        ctx.globalCompositeOperation = "source-atop"; //** 坑锯齿感觉没什么用不知道是不是用错地方了 **
        canvas.width = 640; //dpr * clientWidth;  //由于手机屏幕时retina屏，都会多倍渲染，用dpr来动态设置画布宽高，避免图片模糊
        canvas.height = 1038; //dpr * clientWidth * 609 / 375;//去掉微信头部的状态栏应该是603 没搞懂603还是不能让图片满屏直接多加到了609

        var img = new Image();
        img.setAttribute('crossOrigin','anonymous');
        //   img.crossOrigin = ""; //死坑的图片跨域 （img.crossOrigin = "Anonymous"这种写法还是不能显示base64格式图片）
        img.src = "http://daka.xiaochendu.com/static/ico/build.png"; //背景图
        // img.src=this.qrCode
        img.onload = function () {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          vm.drawPostersImg(canvas, ctx, dpr);
        };
      },

      drawPostersImg: function (canvas, ctx, dpr) {
        var vm = this;
        var imgX = 0; //图片X开始坐标
        var imgY = 0; //图片Y开始坐标
        var imgWidth = 640;
        var imgheight = 740;
        var img = new Image();
        //   img.crossOrigin = "";
        img.setAttribute('crossOrigin','anonymous');
        img.src =
          this.fm;
        // img.src=this.qrCode
        img.onload = function () {
          ctx.drawImage(img, imgX, imgY, imgWidth, imgheight);
          ctx.restore(); // 还原状态
          vm.drawCanvasqrImg(canvas, ctx, dpr);
        };
      },

      // 头像
      drawCanvasqrImg: function (canvas, ctx, dpr) {
        var vm = this;
        var img = new Image();
        img.setAttribute('crossOrigin','anonymous');
        img.src = this.$store.state.userInfo.avatar;
        // img.src=this.qrCode
        img.onload = function () {
          // ctx.clearRect(0, 0, width, height);
          //开始路径画圆,剪切处理
          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = 'white'; // 红
          ctx.strokeStyle = 'white';
          ctx.arc(330, 150, 60, 0, 2 * Math.PI);
          ctx.fill();

          ctx.clip(); //剪切路径
          ctx.drawImage(img, 260, 85);// 第一参数文件 ，第二个参数左距离
          //恢复状态
          ctx.restore();
          vm.canvasTitleFillPin(canvas, ctx, dpr)

        }
      },
      canvasTitleFillPin(canvas, ctx, dpr) {
        var vm = this;
        var fontSizeThis = 40 + "px" + " Avenir";
        var userNameY = 310; //用户名Y轴坐标
        ctx.font = " 300 30px arial";
        // 需要用户名是写入用户名
        if (this.userName) {
          ctx.fillStyle = "white";
          ctx.textAlign = "left";
          var username = ctx.measureText(vm.$store.state.userInfo.nickname + '正在参加').width;
          ctx.fillText(vm.$store.state.userInfo.nickname + "正在参加", (canvas.width - username) / 2, userNameY);

          var hd = '"' + vm.temp.data.title + '"' + "签到活动";
          var w = ctx.measureText(hd).width;

          ctx.fillText(
            hd,
            (canvas.width - w) / 2,
            userNameY + 55
          );
          var jl = ctx.measureText('累积签到').width;//获取文字长度
          ctx.fillText('累积签到', (canvas.width - jl) / 2, userNameY + 200);
          ctx.restore(); // 还原状态
          vm.canvasBlFillPin(canvas, ctx, dpr);
        }
      },

      //签到天数
      canvasBlFillPin(canvas, ctx, dpr) {
        var vm = this;
        var fontSizeThis = 40 + "px" + " Avenir";
        var userNameY = 570; //用户名Y轴坐标
        ctx.font = " bold 60px  arial";
        // 需要用户名是写入用户名
        if (this.userName) {
          ctx.fillStyle = "white";
          ctx.textAlign = "left";

          var t = '第  ' + this.temp.sum + '  天';
          var w = ctx.measureText(t).width;
          ctx.fillText(t, (canvas.width - w) / 2, userNameY + 10);
          ctx.restore(); // 还原状态
        }
        vm.canvaslxFillPin(canvas, ctx, dpr);
      },


      //连续签到
      canvaslxFillPin(canvas, ctx, dpr) {
        var vm = this;
        var fontSizeThis = 40 + "px" + " Avenir";
        var userNameY = 600; //用户名Y轴坐标
        ctx.font = "  30px  arial";
        // // 需要用户名是写入用户名
        if (this.userName) {
          ctx.fillStyle = "white";
          ctx.textAlign = "left";
          var n = '当前连续签到' + this.temp.continuousday + '天';
          var w = ctx.measureText(n).width;
          ctx.fillText(
            n,
            (canvas.width - w) / 2,
            userNameY + 30
          );
          ctx.restore(); // 还原状态
          vm.drawQrCodeImg(canvas, ctx, dpr)
        }
      },


      // 绘制二维码
      drawQrCodeImg: function (canvas, ctx, dpr) {
        var vm = this;
        var imgX = 72; //图片X开始坐标
        var imgY = 800; //图片Y开始坐标
        var imgWidth = 135;
        var img = new Image();
        img.setAttribute('crossOrigin','anonymous');
        // img.crossOrigin = "";
        img.src = this.$store.state.config.wx;
        // img.src=this.qrCode

        img.onload = function () {
          ctx.stroke();
          ctx.drawImage(img, imgX, imgY, imgWidth, imgWidth);
          // ctx.arc(100, 75, 50, 0, 2 * Math.PI);
          ctx.restore(); // 还原状态
          vm.canvasFillPin(canvas, ctx, dpr)

        };
      },


      canvasFillPin(canvas, ctx, dpr) {
        var vm = this;
        var fontSizeThis = 25 + "px" + " Arial";
        var userNameY = 840; //用户名Y轴坐标
        ctx.font = fontSizeThis;
        // 需要用户名是写入用户名
        if (this.userName) {
          ctx.fillStyle = "black";
          ctx.textAlign = "left";
          var w = ctx.measureText(this.userName).width;
          console.log(this.ci.length)

          ctx.fillText(this.ci.substring(0, 10), (canvas.width - w) / 2, userNameY);
          ctx.fillText(
            this.ci.substring(10, 20),
            (canvas.width - w) / 2,
            userNameY + 40
          );
          ctx.fillText(
            this.ci.substring(20, 30),
            (canvas.width - w) / 2,
            userNameY + 80
          );
          ctx.restore(); // 还原状态
          this.drawGzImg(canvas, ctx, dpr);

        }
      },

      // // 绘制二维码
      drawGzImg: function (canvas, ctx, dpr) {
        var vm = this;
        var imgX = 60; //图片X开始坐标
        var imgY = 980; //图片Y开始坐标
        var imgWidth = 500;
        var imgHighth = 50;
        var img = new Image();
        img.setAttribute('crossOrigin','anonymous');
        img.src = 'http://daka.xiaochendu.com/static/ico/gz.png';
        img.onload = function () {
          ctx.stroke();
          ctx.drawImage(img, imgX, imgY, imgWidth, imgHighth);
          // ctx.arc(100, 75, 50, 0, 2 * Math.PI);
          ctx.restore(); // 还原状态

          vm.canvastxFillPin(canvas, ctx, dpr);


        };
      },


      //提醒
      canvastxFillPin(canvas, ctx, dpr) {
        var vm = this;
        var fontSizeThis = 35 + "px" + " Avenir";
        var userNameY = 950; //用户名Y轴坐标
        ctx.font = "  25px  arial";
        // // 需要用户名是写入用户名
        if (this.userName) {
          ctx.fillStyle = "#aaa";
          ctx.textAlign = "left";
          var n = '长按扫码,关注并参与活动';
          var w = ctx.measureText(n).width;
          ctx.fillText(
            n,
            (canvas.width - w) / 2-10,
            userNameY + 62
          );
          ctx.restore(); // 还原状态
          vm.convertCanvasToImage(canvas)

        }
      },

      convertCanvasToImage(canvas) {
        this.imgSrc = canvas.toDataURL("image/jpeg"); //png有毒在安卓机下识别二维码无法跳转
        //   this.$Spin.hide();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .main >>>.van-popup{
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
  }
  .main >>>.van-popup img{
    width: 100%;
  }
  .btn{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 30px;
    width: 30%;
    border-radius: 30px;
    margin: auto;
    background: #39bafc;
    color: #fff;
    margin-top: 20px;
  }
  * {
    margin: 0;
    padding: 0;
  }

  body,
  html {
    width: 100%;
    height: 100%;
    padding-bottom: 30px;
  }

  #imgBox {
    width: 100%;
    height: 100%;

    img {
      border-radius: 10px;
    }
  }

  #imgBox p {
    font-size: 12px;
    line-height: 30px;
    color: #aaa;
    background-color: #fff;
    text-align: center;
    margin-bottom: 10px;
  }

  img {
    width: 80%;
    display: block;
    margin: 0 auto;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  }

  #btn2 {
    display: none;
    margin-bottom: 10px;
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

  .bodyHeight{
    height:100px;
  }
  .contentToggle{
    height:10px;
    line-height:10px;
    text-align: center;
    color:red;
    /*border:1px solid red;*/
    border-radius: 5px;
    margin-bottom:30px;
  }
  .hide-article-box{
    position: absolute;
    top: 206px;
    width: 60%;
    text-align: center;
    background: #fff;
    margin-left: 25%;
  }
  .yy{
    display: flex;
    align-items: center;
    width: 100px;
    audio{
      width: 50px;
    }
  }
</style>
