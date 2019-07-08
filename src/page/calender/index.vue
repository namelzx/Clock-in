<template>
  <div class="calender">
    <!-- <div class="head">
      <header class="headre">
        <div class="userinfo">
          头像
          <div class="desc">
            <span class="desc-name">梁泽祥</span>
            <span class="desc-desc">已签到1天打卡1天</span>
          </div>
        </div>
        <div>每日打卡</div>
      </header>
    </div>-->

    <div class="calender-content-wrapper">
      <div class="header-top">
        <div class="images">
          <img :src="userInfo.avatar" />
        </div>
        <div class="desc">
          <div class="title">{{userInfo.nickname}}</div>
          <div class="info">已签到{{sum}}天，连续签到{{continuousday}}天</div>
        </div>
        <div class="remind"  @click="UnsuDelete">退订</div>
      </div>
    </div>
    <calender @test1="test" :userInfo="userInfo" :markArr="markArr"></calender>
    <van-popup v-model="show" position="bottom">
      <van-datetime-picker v-model="currentDate" type="time"   @cancel="show=false" @confirm="handelremind"/>
    </van-popup>
  </div>
</template>

<script>
import calender from "@cmpt/calender/calender";
import { GetIdBydetailed,GetIdByUnsuDelete } from "@api/colck";
import { Popup, DatetimePicker, Toast } from "vant";

export default {
  name: "App",

  components: {
    calender
  },
  data() {
    return {
      currentDate: "12:00",
      show: false,
      markArr: [],
      userInfo: {},
      sum: 0,
      continuousday: 0,
      id:0,
      detailed:0,

    };
  },
  created() {
    this.userInfo = this.$store.state.userInfo;
    var temp = {};
    this.id=this.$route.query.id;
    temp.id = this.$route.query.id;
    temp.user_id = this.$store.state.user_id;
    GetIdBydetailed(temp).then(res => {
      this.markArr = res.data.data.get_sign;
      this.sum = res.data.sum;
      this.continuousday = res.data.continuousday;
      this.detailed=res.data.data
    });
  },
  methods: {
    handelremind(e){
      console.log(e);
      Toast('设置成功，明天开始将会准时给你提醒');
      this.show=false
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
    },
    test(item) {}
  }
};
</script>
<style lang="scss" scoped>
$fontColor: #fff;
.calender {
  background: $fontColor;
  min-height: 1rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  .calender-top {
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
      display: flex;
      flex-direction: column;
      justify-content: center;
      .info {
        font-weight: 400;
        font-size: 10px;
        color: #868585;
      }
      .info-desc {
        padding-top: 0.5rem;
        font-size: 0.1rem;
        font-weight: 400;
        color: #e0e0e0;
      }
    }
    .remind {
      font-weight: 400;
      font-size: 0.2rem;
      padding-left: 0.5rem;

      color: black;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  .calender-content-wrapper {
    display: flex;
    height: 1.5rem;
    flex-direction: column;
    justify-content: center;
    font-weight: 800;
    color: #868585;
    background: #fff;
    border-bottom: 1px dashed #d0caca;
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
    margin-top: 0.2rem;
    padding-left: 0.2rem;
    font-size: 0.25rem;
    font-weight: 500;
    color: #868585;
    .list-items {
      .items-header {
        display: flex;
        flex-direction: row;
        .day {
          padding-right: 0.4rem;
        }
      }
      .items-desc {
        height: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: black;
        font-weight: 400;
      }
    }
  }
}
.calender {
  height: 100%;
  background: #f8f8f8;

  background: linear-gradient(
    to top,
    #fff,
    #f8f8f8
  ); /* 标准的语法（必须放在最后） */
}

.head {
  padding-top: 2%;
  padding-bottom: 2%;
}
.headre {
  background: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 96%;
  margin: auto;
  height: 1rem;
  align-items: center;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3),
    0px 0px 15px rgba(0, 0, 0, 0.1) inset;
}
.headre .userinfo {
  display: flex;
  flex-direction: row;
}
.headre .userinfo .desc {
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 0.1rem;
}
.headre .userinfo .desc .desc-name {
  font-size: 0.25rem;
}
.headre .userinfo .desc .desc-desc {
  font-size: 0.16rem;
  color: #656b79;
  padding-top: 0.01rem;
  padding-bottom: 0.01rem;
}
</style>

