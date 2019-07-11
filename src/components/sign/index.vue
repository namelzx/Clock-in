<template>
  <div class="sign">
    <div class="sign-top">
      <div class="title">{{title}}</div>
    </div>
    <div class="calender-content-wrapper">
      <div class="header-top">
        <div class="images">
          <img :src="userInfo.avatar"/>
        </div>
        <div class="desc">
          <div class="title">{{userInfo.nickname}}</div>
          <div class="info">已签到{{sum}}天，连续签到{{continuousday}}天</div>
        </div>
      </div>
    </div>
    <div class="list" v-for="(item,index) in list" :key="index">
      <div class="ico">
        <div style="height:11px">
          <img src="../../assets/images/ico.png"/>
        </div>
        <div class="xt">&nbsp;</div>
      </div>
      <div class="list-items">
        <div class="items-header">
          <div class="day">{{item.create_time}}</div>
        </div>
        <div class="items-desc">
          <div class="yy">
            <!--<audio v-if="item.voice_url" :src="item.voice_url"></audio>-->
            <m-audio  v-if="item.voice_url" :src="item.voice_url"></m-audio>

            <!---->
            <!--<audio ref="player" v-if="item.voice_url" :src="item.voice_url" controls></audio>-->
            <!--<span class="tt" v-if="item.voice_url" >{{item.time_len}}</span>-->
          </div>
          <div class="sign-desc"> {{item.desc}}</div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
  import Vue from 'vue'

  import audio from 'vue-mobile-audio'
  Vue.use(audio);

  export default {
    props: {
      headimgurl: String,
      title: String,
      continuousday: Number,
      sum: Number,
      userInfo: {
        type: Object,
        default() {
          return {};
        }
      },
      list: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    comments:{
      audio
    },

    data() {
      return {
        detailes: {
          tx:
            "https://img.zcool.cn/community/011cff5c7e3893a801213f26f4fed1.jpg@1280w_1l_2o_100sh.jpg"
        }
      };
    },
    methods: {
      updateTime(e) {
        this.currentTime = e.target.currentTime;  //获取audio当前播放时间
      },
    },
    watch: {
      list(newValue, oldValue) {
        this.newdata = newValue;
      },
      sum(newValue, oldValue) {
      },
      userInfo(newValue, oldValue) {
      },
      deep: true
    }
  };
</script>
<style lang="scss" scoped>
  $fontColor: #fff;
  .desc > > > .iconfont {
    font-size: 13px;
  }

  .sign {
    padding: 0.3rem;
    background: $fontColor;
    min-height: 1rem;
    display: flex;
    flex-direction: column;
    margin-top: 0.2rem;
    margin-bottom: 2rem;
    padding-bottom: 3rem;

    .sign-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 0.5rem;
      align-items: center;

      .title {
        font-size: 0.3rem;
        color: black;
      }

      .desc {
        color: #868585;
      }
    }

    .header-top {
      display: flex;
      flex-direction: row;
      // padding-top: 0.2rem;
      padding-left: 0.2rem;
      color: #fff;

      // align-items: center;
      img {
        width: 1rem;
        height: 1rem;
        border-radius: 100%;
      }

      .desc {
        font-weight: 500;
        font-size: 0.35rem;
        padding-left: 0.3rem;
        color: black;

        .info {
          font-weight: 400;
          font-size: 12px;
          color: #868585;
        }

        .info-desc {
          padding-top: 0.5rem;
          font-size: 0.1rem;
          font-weight: 400;
          color: #e0e0e0;
        }
      }
    }

    .calender-content-wrapper {
      display: flex;
      height: 1.5rem;
      flex-direction: column;
      justify-content: center;
      font-weight: 800;
      color: #868585;
      border-bottom: 1px dashed #d0caca;
      margin-bottom: .25rem;

      .calender-days-wrapper {
        display: flex;
        flex-direction: row;
        height: 0.5rem;
        align-items: center;
        width: 100%;

        .calender-days {
          width: 14%;
          text-align: center;
        }

        .calender-arrow-item {
          width: 14%;
          text-align: center;
          justify-content: center;
          display: flex;
          // background: #c2c9cb;
          // border-radius: 100%;
          padding: 0.1rem;
          margin-right: 0.1rem;

          .span {
            background: red;
          }

          .d {
            background: #4dc862;
            color: #fff;
            width: 20px;
            height: 20px;
            border-radius: 50px;
            line-height: 20px;
          }
        }
      }
    }

    .list {
      // margin-top: 0.2rem;
      padding-left: 0.2rem;
      font-size: 0.25rem;
      font-weight: 500;
      color: #868585;
      display: flex;
      flex-direction: row;

      .ico {
        display: flex;
        flex-direction: column;
        img {
          width: 14px;
        }

        .xt {
          border-left: 1px solid #edece8;
          margin-left: 6px;
          height: 100%;
        }
      }

      .list-items {
        padding-left: .25rem;

        .items-header {
          display: flex;
          flex-direction: row;

          .day {
            padding-right: 0.4rem;
          }
        }

        .items-desc {
          // height: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: black;
          font-weight: 400;
          padding-top: 16px;
          padding-bottom: 30px;
          font-size: .25rem;
          /*text-indent: 20px;*/
          .yy{
            /*background: red;*/
            display: flex;
            align-items: center;
            width: 100px;
            audio{
              width: 50px;

            }
            .sign-desc{
              font-size: 15px;
            }

            .tt{
              text-align: center;
            }
          }


        }
      }
    }
  }

</style>

<style type="text/css">
  .box {
    width: 30px;
    height: 30px;
    box-sizing: border-box;
    position: relative;
  }
  .wifi-symbol {
    width: 50px;
    height: 50px;
    box-sizing: border-box;
    overflow: hidden;
    transform: rotate(135deg);

  }
  .wifi-circle {
    border: 5px solid #999999;
    border-radius: 50%;
    position: absolute;
  }

  .first {
    width: 5px;
    height: 5px;
    background: #cccccc;
    top: 45px;
    left: 45px;
  }

  .second {
    width: 25px;
    height: 25px;
    top: 35px;
    left: 35px;
    /*animation: fadeInOut 1s infinite 0.2s;.*/

  }

  .third {
    width: 40px;
    height: 40px;
    top: 25px;
    left: 25px;
    animation: fadeInOut 1s infinite 0.4s;
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0; /*初始状态 透明度为0*/
    }
    100% {
      opacity: 1; /*结尾状态 透明度为1*/
    }
  }
</style>


