<template>
  <div v-show="show">
    <div class="detailed">
      <header :style="back">
        <div class="header-top">
          <div class="images">
            <img :src="detailes.tx" />
          </div>
          <div class="desc">
            <div class="title">{{detailed.title}}</div>
            <div class="info">1282人参与|5196人打卡</div>
            <div class="info-desc">{{detailed.desc}}</div>
          </div>
        </div>
      </header>
      <weeks :markArr="markAll" :id="id" @sendiptVal="showChildMsg"></weeks>
      <card :desc="desc"></card>
      <sign
        :title="sign"
        :userInfo="userInfo"
        :list="markArr"
        :sum="sum"
        :continuousday="continuousday"
      ></sign>
    </div>
    <div class="btn" @click="toUrl">签到</div>
    <div class="tdbtn" @click="UnsuDelete">退订</div>
  </div>
</template>

<script>
import weeks from "@cmpt/calender/weeks";

import card from "@cmpt/card";

import sign from "@cmpt/sign";

import { GetIdBydetailed, GetIdByUnsuDelete } from "@api/colck";
import { mapGetters } from "vuex";
import { Toast } from "vant";
import { getDataByUser } from "@api/user";

export default {
  components: {
    weeks,
    card,
    sign
  },
  data() {
    return {
      show:false,
      id: 0,
      desc: "111",
      detailed: {},
      list: [],
      temp: {
        id: undefined,
        days: undefined
      },
      continuousday: 0,
      sum: 0,
      userInfo: {},
      sign: "签到记录",
      markArr: [],
      markAll: [],
      fullPath: "",
      detailes: {
        tx:
          "https://img.zcool.cn/community/011cff5c7e3893a801213f26f4fed1.jpg@1280w_1l_2o_100sh.jpg"
      },
      back:
        "background: url(https://img.zcool.cn/community/0160265b568b19a80121ade064d92a.jpg@1280w_1l_2o_100sh.jpg);"
    };
  },
  created() {
    this.fullPath = location.href;
    this.userInfo = this.$store.state.userInfo;
    Toast.loading({
      mask: true,
      message: "加载中..."
    });
    // console.log()
    this.id = this.$route.query.id;
    this.temp.id = this.id;
    if (this.$route.query.days) {
      this.temp.days = this.$route.query.days;
    }
    this.getData();
  },

  methods: {
    getData() {
      this.temp.user_id = this.$store.state.user_id;
      if (this.$route.query.user_id > 0) {
        getDataByUser(this.$route.query.user_id).then(res => {
          this.$store.state.userInfo = res.data;
          this.$store.state.user_id = res.data.id;
          this.userInfo = res.data;
        });
         this.temp.user_id =this.$route.query.user_id;
      }
      GetIdBydetailed(this.temp).then(res => {
        this.detailed = res.data.data;
        this.markArr = res.data.data.get_sign;
        this.markAll = res.data.data.get_signall;
        this.sum = res.data.sum;
        this.desc = this.detailed.desc;
        this.continuousday = res.data.continuousday;
        this.show=true;
        Toast.clear();
      });
    },
    showChildMsg(temp) {
      Toast.loading({
        mask: true,
        message: "加载中..."
      });
      this.temp = temp;
      this.getData();
    },
    toUrl() {
      this.$router.push({ name: "test", params: { id: this.id } });
    },
    UnsuDelete() {
      var temp = {
        zhuti_id: this.id,
        user_id: this.$store.state.user_id
      };
      if (this.$store.state.userInfo.id === this.detailed.user_id) {
        Toast("不能退订自己建立的主题");
        return;
      }
      GetIdByUnsuDelete(temp).then(res => {
        this.$router.push({ path: "/" });
      });
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
          font-size: 0.25rem;
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
  width: 8%;
  margin: auto;
  text-align: center;
  background: #39bafc;
  padding: 10px;
  color: #fff;
  font-size: 0.3rem;
  font-weight: 800;
  border-radius: 1rem;
  margin-left: 80%;
}
.tdbtn {
  position: fixed;
  bottom: 1.5rem;
  position: fixed;
  width: 8%;
  margin: auto;
  text-align: center;
  background: #39bafc;
  padding: 10px;
  color: #fff;
  font-size: 0.3rem;
  font-weight: 800;
  border-radius: 1rem;
  margin-left: 80%;
}
</style>

