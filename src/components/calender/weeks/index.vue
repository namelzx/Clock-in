<template>
  <div class="week">
    <div class="week-top">
      <div class="title">签到日历</div>
      <div class="desc" @click="tocalender">
        完整日历
        <i class="iconfont">&#xe677;</i>
      </div>
    </div>
    <div class="calender-content-wrapper">
      <div class="calender-days-wrapper">
        <div class="calender-days">Sun</div>
        <div class="calender-days">Mon</div>
        <div class="calender-days">Tue</div>
        <div class="calender-days">Wed</div>
        <div class="calender-days">Thu</div>
        <div class="calender-days">Fri</div>
        <div class="calender-days">Sat</div>
      </div>

      <div class="calender-days-wrapper">
        <div
          class="calender-arrow-item"
          v-for="(item,index) in  sevenday"
          :key="index"
          @click="handelDay(item.zhuti_id,item.days)"
        >

          <!--<div v-if="item.day==day" :class="item.chetrue?'d':''">今</div>-->
          <div v-if="item.day<day" :class="item.chetrue?'d':'c'">
            <span v-if="item.day<day" :class="item.chetrue?'d':''">{{item.day}}</span>
            <span v-else :class="item.chetrue?'d':''">{{item.day}}</span>
            <!--{{item.day}}-->
            <!--{{item.chetrue}}-->
          </div>
          <div v-else :class="item.chetrue?'d':''">
            <span  :class="item.chetrue?'d':''" v-if="item.day==day">今</span>
            <span  :class="item.chetrue?'d':''" v-else>{{item.day}}</span>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, InfiniteScroll } from "mint-ui";
export default {
  props: {
    id: {
      type: Number,
      default() {
        return 0;
      }
    },
    markArr: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      day: "",
      month: "",
      year: "",
      currentDays: "",
      daysArr: [],
      clickItemObj: {},
      sevenday: [],
      newdata: []
    };
  },
  mounted() {
    this._getCurrentDate();
  },

  methods: {
    tocalender() {
      this.$router.push({
        path: "/calender",
        query: {
          id: this.id
        }
      });
    },
    handelDay(id, days) {
      if (id ===undefined) {
        Toast("未签到");
        return false;
      } else {
        var temp = {
          id,
          days
        };
        this.$emit("sendiptVal", temp); //传值父组件

        this.$router.push({
          path: "/detailed",
          query: {
            id,
            days
          }
        });
        // this.$router.push({ name: "detailed", params: { id:25 ,days:3} });
      }
    },
    //点击日期
    _clickDaysItem(item) {
      //选中日期标记与解除标记
      if (this.clickItemObj === item) {
        this.clickItemObj = {};
      } else {
        this.clickItemObj = item;
      }
      //非当前月份跳转
      if (item.month != this.month) {
        this.month = item.month;
      }
      //传入事件筛选回返
      this._user_defined_events(item);
    },
    //mark渲染
    _user_defined_events(item) {
      for (let i = 0; i < this.markArr.length; i++) {
        if (
          this.markArr[i].days.includes(
            `${item.year}-${item.month}-${item.day}`
          )
        ) {
          this.$emit(this.markArr[i].clickEvent, item);
        }
      }
    },
    //是否显示mark
    _visibleTemp(d, item) {
      let dateStr = `${item.year}-${item.month}-${item.day}`;
      return d.days.includes(dateStr);
    },
    //获取月份天数
    _getDaysForMonth(year, month, type) {
      let temp = new Date(year, month, type);
      let day = new Date(temp.getTime() - 864e5).getDate();
      this.currentDays = day;
      this._getFirstDaysForMonth(this.year, this.month);
    },
    //获取当前日期
    _getCurrentDate() {
      let date = new Date();
      this.day = date.getDate();
      this.month = date.getMonth() + 1;

      this.year = date.getFullYear();
      this._getDaysForMonth(this.year, this.month, 1);
    },
    //获取切换页月份第一天是周几与最后一天并获取月前与月后填补数组
    _getFirstDaysForMonth(year, month) {
      var that = this;
      let weekdays = new Date(`${year}-${month}-01`).getDay();

      let beforeMonthDaysArr = [];
      let currentMonthDaysArr = [];
      let afterMonthDaysArr = [];
      //获取上一月总天数
      if (month) {
        let temp = new Date(year, month - 1, 1);
        let day = new Date(temp.getTime() - 864e5).getDate();
        for (let i = 0; i < day; i++) {
          beforeMonthDaysArr.push({
            year: year,
            month: month - 1,
            day: i + 1
          });
        }
        beforeMonthDaysArr.splice(0, beforeMonthDaysArr.length - weekdays);
      } else {
        //12月
      }
      //获取当前月总天数
      let temp = new Date(year, month, 1);
      let day = new Date(temp.getTime() - 864e5).getDate();
      let afterWeekdays = new Date(`${year}-${month}-${day}`).getDay();
      for (let i = 0; i < day; i++) {
        currentMonthDaysArr.push({
          year: year,
          month: month,
          day: i + 1
        });
      }

      if (
        beforeMonthDaysArr.length +
          currentMonthDaysArr.length +
          6 -
          afterWeekdays ===
        35
      ) {
        for (let i = 0; i < 13 - afterWeekdays; i++) {
          afterMonthDaysArr.push({
            year: year,
            month: month + 1,
            day: i + 1
          });
        }
      } else {
        for (let i = 0; i < 6 - afterWeekdays; i++) {
          afterMonthDaysArr.push({
            year: year,
            month: month + 1,
            day: i + 1
          });
        }
      }
      this.daysArr = [
        ...beforeMonthDaysArr,
        ...currentMonthDaysArr,
        ...afterMonthDaysArr
      ];
      let date = new Date();
      var daydate =
        date.getFullYear() +
        "-" +
        parseInt(date.getMonth() + 1) +
        "-" +
        date.getDate();
      var daydaysArr = [];

      //循环获取最新七天时间
      for (let i = 0; i < this.daysArr.length; i++) {
        let dateStr =
          this.daysArr[i].year +
          "-" +
          this.daysArr[i].month +
          "-" +
          this.daysArr[i].day;
        this.daysArr[i].id = 0;

        if (dateStr === daydate) {
          for (let k = -2; k < 5; k++) {
            daydaysArr[k + 2] = this.daysArr[i + k];
          }
        }
      }

      for (let i = 0; i < daydaysArr.length; i++) {
        let dateStr =
          daydaysArr[i].year +
          "-" +
          daydaysArr[i].month +
          "-" +
          daydaysArr[i].day;
        // daydaysArr[i].id = 0;
        for (let k = 0; k < that.markArr.length; k++) {
          var chetrue = false;
          if (dateStr === that.markArr[k].days) {
            daydaysArr[i].chetrue = true;
            daydaysArr[i].id = that.markArr[k].id;
            daydaysArr[i].zhuti_id = that.markArr[k].zhuti_id;
            daydaysArr[i].days = that.markArr[k].days;
            break;
          } else {
            daydaysArr[i].chetrue = false;
          }
        }
      }
      this.sevenday = daydaysArr;
      //获取下一月总天数
    }
  },
  watch: {
    markArr(newValue, oldValue) {
      this.newdata = newValue;
      this._getCurrentDate();
    },
    deep: true
  }
};
</script>
<style lang="scss" scoped>
$fontColor: #fff;
$weekBg:#c2c9cb;
.desc >>> .iconfont {
  font-size: 13px;
}
.week {
  padding: 0.3rem;
  background: $fontColor;
  height: 2rem;
  display: flex;
  flex-direction: column;
  .week-top {
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
    .calender-days-wrapper {
      display: flex;
      flex-direction: row;
      height: 0.5rem;
      align-items: center;
      width: 100%;
      padding-top: 10px;
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
          width: 30px;
          height: 30px;
          border-radius: 50px;
          line-height: 30px;
        }
        .vv{
          /*background: #c6c7c9;*/
          /*color: #fff;*/
          /*width: 20px;*/
          /*height: 20px;*/
          /*border-radius: 50px;*/
          /*line-height: 20px;*/
          /*padding: 2px;*/
          /*padding-left: 7px;*/
          /*padding-right: 7px;*/
        }
        .c{
          width: 30px;
          height: 30px;
          background: #999;
          border-radius: 100%;
          line-height: 30px;
          background: #c2c9cc;
          color: #fff;
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
        background: $weekBg;
        border-radius: 100%;
        padding: 0.1rem;
      }
    }
  }
}
</style>

