<template>
  <div>
    <div id="imgBox">
      <p>长按图片保存到系统相册中然后分享</p>
      <img :src="imgSrc" v-if="imgSrc" />
    </div>
  </div>
</template>

<script>
// import html2canvas from "html2canvas";

// import QRcode from "@xkeshi/vue-qrcode";

export default {
  data() {
    return {
      userName: "千里草", //用户称呢
      imgSrc: "", //合成最终图片
      qrCode:
        "http://img0.imgtn.bdimg.com/it/u=413241571,1035325901&fm=26&gp=0.jpg" //二维码
    };
  },
  mounted() {
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
      img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        vm.drawPostersImg(canvas, ctx, dpr);
      };
      console.log(img.src);
    },

    drawPostersImg: function(canvas, ctx, dpr) {
      var vm = this;
      var imgX = 0; //图片X开始坐标
      var imgY = 0; //图片Y开始坐标
      var imgWidth = 640;
      var imgheight = 740;
      var img = new Image();
      //   img.crossOrigin = "";
      img.src = this.qrCode;
      img.onload = function() {
        ctx.drawImage(img, imgX, imgY, imgWidth, imgheight);
        ctx.restore(); // 还原状态
        vm.drawCanvasqrImg(canvas, ctx, dpr);
      };
    },

    // 绘制二维码
    drawCanvasqrImg: function(canvas, ctx, dpr) {
      var vm = this;
      var imgX = 72; //图片X开始坐标
      var imgY = 800; //图片Y开始坐标
      var imgWidth = 135;
      var img = new Image();
      img.crossOrigin = "";
      img.src = this.qrCode;
      img.onload = function() {
        ctx.stroke();
        ctx.drawImage(img, imgX, imgY, imgWidth, imgWidth);
        ctx.arc(100, 75, 50, 0, 2 * Math.PI);
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
