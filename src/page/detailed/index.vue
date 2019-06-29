<template>
  <div>
    <div class="detailed">
      <header :style="back">
        <div class="header-top">
          <div class="images">
            <img :src="detailes.tx">
          </div>
          <div class="desc">
            <div class="title">轻课每日读书打卡</div>
            <div class="info">5938人参与|5196人打卡</div>
            <div class="info-desc">每日听力打卡</div>
          </div>
        </div>
      </header>
      <weeks :markArr="markArr" :id="id" @sendiptVal="showChildMsg"></weeks>
      <card></card>
      <sign :title="sign" :list="list"></sign>
    </div>
    <div class="btn">立即签到</div>
  </div>
</template>

<script>
import weeks from "@cmpt/calender/weeks";

import card from "@cmpt/card";

import sign from "@cmpt/sign";

export default {
  components: {
    weeks,
    card,
    sign
  },
  data() {
    return {
      id:0,
      list: [
        {
          day: "2019-06-27",
          daytime: "18:13:42",
          desc: "今天就1打卡试试卡",
          audio: null
        },
        {
          day: "2019-06-27",
          daytime: "18:12:42",
          desc: "今天就打卡试试卡",
          audio: null
        },
        {
          day: "2019-06-26",
          daytime: "18:12:42",
          desc: "今天就打卡试试卡",
          audio: null
        }
      ],
      sign: "签到记录",
      markArr: [
        {
          id: 1,
          color: "#ffc518",
          name: "测试三",
          days: "2019-6-28",
          clickEvent: "test3"
        },
        {
          id: 10,
          color: "#ffc518",
          name: "测试1",
          days: "2019-6-29",
          clickEvent: "test3"
        },
        {
          id: 9,
          color: "#ffc518",
          name: "测试8",
          days: "2019-6-27",
          clickEvent: "test3"
        },
        {
          id: 8,
          color: "#ffc518",
          name: "测试8",
          days: "2019-6-19",
          clickEvent: "test3"
        }
      ],
      detailes: {
        tx:
          "https://img.zcool.cn/community/011cff5c7e3893a801213f26f4fed1.jpg@1280w_1l_2o_100sh.jpg"
      },
      back:
        "background: url(https://img.zcool.cn/community/0160265b568b19a80121ade064d92a.jpg@1280w_1l_2o_100sh.jpg);"
    };
  },
  created() {
    this.id=this.$route.params.id;
  },
  methods:{
    showChildMsg(id){
      this.id=id
      console.log('更新')
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
        font-size: 0.35rem;
        padding-left: 0.3rem;
        .info {
          font-weight: 400;
          font-size: 10px;
        }
        .info-desc {
          padding-top: 0.5rem;
          font-size: 0.1rem;
          font-weight: 400;
          color: #e0e0e0;
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
  width: 90%;
  margin: auto;
  text-align: center;
  background: #39bafc;
  padding: 10px;
  color: #fff;
  font-size: 0.3rem;
  font-weight: 800;
  border-radius: 1rem;
  margin-left: 2%;
}
</style>

