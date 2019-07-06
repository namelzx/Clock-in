<template>
  <div>
    <div id="imgBox">
      <p>长按图片保存到系统相册中然后分享</p>
      <img :src="imgSrc" v-if="imgSrc"/>
    </div>
  </div>
</template>

<script>
  // import html2canvas from "html2canvas";

  // import QRcode from "@xkeshi/vue-qrcode";

  import {GetIdBydetailed} from "@api/colck";

  export default {
    data() {
      return {
        temp: {},
        userName: "千里草", //用户称呢
        imgSrc: "", //合成最终图片
        avater:
          "http://thirdwx.qlogo.cn/mmopen/vi_32/BNxCMUpjhvRr1MKFKicjCuVxh5bC16ZvibRUeCc5X16UFs6mRrQqlqz8P3rSoEX3uwId7BKyuFx4dlTjgluFPFzg/132",
        qrCode:
          "http://img0.imgtn.bdimg.com/it/u=413241571,1035325901&fm=26&gp=0.jpg" //二维码
      };
    },

    created() {

      var temp = {
        id: this.$route.query.id,
        user_id: this.$store.state.user_id,
      }
      GetIdBydetailed(temp).then(res => {
        this.temp = res.data
      })
      this.drawCanvasBgImg();
    },
    methods: {
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
        //   img.crossOrigin = ""; //死坑的图片跨域 （img.crossOrigin = "Anonymous"这种写法还是不能显示base64格式图片）
        img.src = "https://pwmapi.oss-cn-beijing.aliyuncs.com/bj.png"; //背景图
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
        img.src =
          "https://hbimg.huabanimg.com/0f3f894c234e1203132f5e7f3fd77226185620de73f65-S2hhIc_fw658";
        img.onload = function () {
          ctx.drawImage(img, imgX, imgY, imgWidth, imgheight);
          ctx.restore(); // 还原状态
          vm.drawCanvasqrImg(canvas, ctx, dpr);
        };
      },

      // 绘制二维码
      drawCanvasqrImg: function (canvas, ctx, dpr) {
        var vm = this;
        var imgX = 72; //图片X开始坐标
        var imgY = 800; //图片Y开始坐标
        var imgWidth = 135;
        var img = new Image();
        img.crossOrigin = "";
        img.src = this.qrCode;
        img.onload = function () {
          ctx.stroke();
          ctx.drawImage(img, imgX, imgY, imgWidth, imgWidth);
          // ctx.arc(100, 75, 50, 0, 2 * Math.PI);
          ctx.restore(); // 还原状态
          vm.canvasFillPin(canvas, ctx, dpr);
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
          ctx.fillText("千山鸟飞绝,", (canvas.width - w) / 2, userNameY);
          ctx.fillText(
            "驽马十驾，功在不舍,",
            (canvas.width - w) / 2,
            userNameY + 40
          );
          ctx.fillText(
            "驽马十驾，功在不舍,",
            (canvas.width - w) / 2,
            userNameY + 80
          );
          ctx.restore(); // 还原状态
          this.convertCanvasToImage(canvas);
          vm.drawCanvasAvaterImg(canvas, ctx, dpr);
          vm.canvasTitleFillPin(canvas, ctx, dpr);
        }
      },
      //标题
      canvasTitleFillPin(canvas, ctx, dpr) {
        var vm = this;
        var fontSizeThis = 40 + "px" + " Avenir";
        var userNameY = 310; //用户名Y轴坐标
        ctx.font = " 300 30px arial";
        // 需要用户名是写入用户名
        if (this.userName) {
          ctx.fillStyle = "white";
          ctx.textAlign = "left";
          var username = ctx.measureText('梁泽祥正在参加').width;

          ctx.fillText("梁泽祥正在参加", (canvas.width - username) / 2, userNameY);

          var hd = '"' + this.temp.data.title + '"' + "签到活动";
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

          var t = '第' +  this.temp.sum + '天';
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
        ctx.font = " 300 30px  arial";
        // 需要用户名是写入用户名
        if (this.userName) {
          ctx.fillStyle = "white";
          ctx.textAlign = "left";
          var n= '当前连续签到'+this.temp.continuousday+'天';
          var w = ctx.measureText(n).width;
          ctx.fillText(
            n,
            (canvas.width - w) / 2,
            userNameY + 30
          );
          ctx.restore(); // 还原状态
        }
      },

      drawCanvasAvaterImg: function (canvas, ctx, dpr) {
        var vm = this;
        var circle = {
          x: imgWidth / 2,
          y: imgWidth / 2,
          r: imgWidth / 2
        };
        var imgX = 102; //图片X开始坐标
        var imgY = 800; //图片Y开始坐标
        var imgWidth = 140;
        var img = new Image();
        img.crossOrigin = "";
        img.src = this.avater;
        img.onload = function () {
          var width = img.width;
          var height = img.height;
          var circle = {
            x: width / 2,
            y: height / 2,
            r: width / 2
          };
          // ctx.clearRect(0, 0, width, height);
          //开始路径画圆,剪切处理
          ctx.save();
          ctx.beginPath();
          ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
          // ctx.clip(); //剪切路径
          ctx.drawImage(img, 250, 100);
          //恢复状态
          ctx.restore();

          vm.canvasFillPin(canvas, ctx, dpr);
        };
      },


      convertCanvasToImage(canvas) {
        this.imgSrc = canvas.toDataURL("image/jpeg"); //png有毒在安卓机下识别二维码无法跳转
        //   this.$Spin.hide();
      }
    }
  };
</script>

<style lang="scss" scoped>
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
</style>
