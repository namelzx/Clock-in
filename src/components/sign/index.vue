<template>
  <div class="sign">
    <div class="sign-top">
      <div class="title">{{title}}</div>
    </div>

    <div class="calender-content-wrapper">
      <div class="header-top">
        <div class="images">
          <img :src="detailes.tx">
        </div>
        <div class="desc">
          <div class="title">J-R梁泽祥</div>
          <div class="info">已签到3天，连续签到3天</div>
        </div>
      </div>
    </div>
    <div class="list" v-for="(item,index) in list" :key="index">
      <div class="list-items" >
        <div class="items-header">
          <div class="day">{{item.day}}</div>
          <div class="time">{{item.daytime}}</div>
        </div>
        <div class="items-desc">{{item.desc}}</div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    title: String,
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  
  data() {
    return {
     
      detailes: {
        tx:
          "https://img.zcool.cn/community/011cff5c7e3893a801213f26f4fed1.jpg@1280w_1l_2o_100sh.jpg"
      }
    };
  }
};
</script>
<style lang="scss" scoped>
$fontColor: #fff;
.desc >>> .iconfont {
  font-size: 13px;
}
.sign {
  padding: 0.3rem;
  background: $fontColor;
  min-height: 1rem;
  display: flex;
  flex-direction: column;
  margin-top: 0.2rem;
  margin-bottom: 1rem;
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
  }
  .calender-content-wrapper {
    display: flex;
    height: 1.5rem;
    flex-direction: column;
    justify-content: center;
    font-weight: 800;
    color: #868585;
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
      margin-top:.2rem;
    padding-left: 0.2rem;
    font-size: 0.25rem;
    font-weight: 500;
    color: #868585;
    .list-items {
      .items-header {
        display: flex;
        flex-direction: row;
        .day{
            padding-right: .4rem;
        }
      }
      .items-desc{
          height: 1rem;
          display: flex;
            flex-direction: column;
          justify-content:center;
          color: black;
          font-weight: 400;
      }
    }
  }
}

</style>

