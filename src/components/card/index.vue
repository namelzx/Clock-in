<template>
  <div class="card">
    <div class="card-top">
      <div class="title">签到主题</div>
    </div>

    <div class="calender-content-wrapper">
      <span v-if="desc"> {{desc}}</span>
      <span v-else>没有主题哦，可以自行输入签到内容</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    desc:String,
    markArr: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    desc(newValue, oldValue) {
      console.log(newValue)
    },
   
    deep: true
  }
};
</script>
<style lang="scss" scoped>
$fontColor: #fff;
.desc >>> .iconfont {
  font-size: 13px;
}
.card {
  padding: 0.3rem;
  background: $fontColor;
  min-height: 1rem;
  display: flex;
  flex-direction: column;
  margin-top: 0.2rem;
  .card-top {
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
  .calender-content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: 800;
   color: #868585;
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
    .calender-days {
      //      display: flex;
      //   flex-direction: row;
      width: 100%;
      .calender-arrow-item {
        width: 14%;
        float: left;
        text-align: center;
        background: #c2c9cb;
        border-radius: 100%;
        padding: 0.1rem;
      }
    }
  }
}
</style>

