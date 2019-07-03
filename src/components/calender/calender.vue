<template>
  <div class="calender">
    <div class="calender-title-wrapper">
      <div class="calender-title">
        <div class="calender-arrow-item left2" v-if="false"></div>
        <div class="calender-arrow-item left1" @click="month--">
          <i class="iconfont">&#xe61c;</i>
        </div>
        <div class="calender-Date-text">{{year}}年{{month}}月</div>
        <div class="calender-arrow-item right1" @click="month++">
          <i class="iconfont">&#xe616;</i>
        </div>
        <div class="calender-arrow-item right2" v-if="false"></div>
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
      <div class="calender-content">
        <div
          class="calender-item-wrapper"
          v-for="(item,index) in daysArr"
          :key="index"
          :class="{'no-current-day':item.month!=month,
                    active:item === clickItemObj,
                    currentDay:item.day===_CurrentDate.day&&
                               item.month===_CurrentDate.month&&
                               item.year===_CurrentDate.year}"
          @click="_clickDaysItem(item)"
        >
          <div class="calender-item" :class="item.chetrue?'d':''" @click="handelDay(item.zhuti_id,item.days)">
            <span v-if="item.day==day">今</span>
            <span v-else>{{item.day}}</span>
          </div>
        </div>
      </div>
      <!-- <div class="calender-mask-wrapper">
        <div class="calender-mask-item" v-for="(item ,index) in markArr" :key="index">
          <span class="tem" :style="{background:item.color}"></span>
          <span class="text">{{item.name}}</span>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import { Toast, InfiniteScroll } from "mint-ui";

export default {
  name: "calender",
  props: {
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
      clickItemObj: {}
    };
  },
  mounted() {
    this._getCurrentDate();
  },
  created() {},
  methods: {
    handelDay(id,days) {
      if (id === 0) {
        Toast("未签到");
      } else {
        // this.$router.push({ name: "detailed", params: { id: id } });
        // Toast("今日已签到");
         this.$router.push({
          path: "/detailed",
          query: {
            id,
            days
          }
        });
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
          // this.$emit(this.markArr[i].clickEvent, item);
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
      for (let i = 0; i < this.daysArr.length; i++) {
        let dateStr =
          this.daysArr[i].year +
          "-" +
          this.daysArr[i].month +
          "-" +
          this.daysArr[i].day;
        this.daysArr[i].id = 0;

        for (let k = 0; k < this.markArr.length; k++) {
          // var chetrue = this.markArr[k].includes(dateStr);
          var chetrue = false;
          //       this.day = date.getDate();
          // this.month = date.getMonth() + 1;
          // this.year = date.getFullYear();
          if (dateStr === this.markArr[k].days) {
            //  console.log( this.daysArr[i].day,'真')
            this.daysArr[i].chetrue = true;
            this.daysArr[i].id = this.markArr[k].id;
            this.daysArr[i].zhuti_id = this.markArr[k].zhuti_id;
            this.daysArr[i].days = this.markArr[k].days;
            break;
          } else {
            this.daysArr[i].chetrue = false;
          }
          // if (chetrue) {
          //    console.log( this.daysArr[i].day,'真')
          // } else {

          //   console.log( this.daysArr[i].day,'假')
          // }
        }
      }
      //获取下一月总天数
    }
  },
  watch: {
    markArr(newValue, oldValue) {
      this._getCurrentDate();
    },
    deep: true,
    month() {
      if (this.month === 0) {
        this.month = 12;
        this.year--;
      }
      if (this.month === 13) {
        this.month = 1;
        this.year++;
      }
      this._getDaysForMonth(this.year, this.month, 1);
    }
  },
  computed: {
    _CurrentDate() {
      let date = new Date();
      let { day, month, year } = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      };
      return { day, month, year };
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#app {
  background: #f8f8f8;
}

.calender {
  text-align: center;
  min-width: 280px;
  height: 350px;
  background: #fff;
}
.calender-days-wrapper {
  display: flex;
}
.calender-days-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.calender-days {
  width: 14%;
}
.calender-item-wrapper {
  width: 14%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.calender-item {
  border-radius: 100%;
  width: 0.4rem;
  height: 0.4rem;
  line-height: 0.4rem;
  margin-bottom: 0.3rem;
  font-weight: 600;
  font-family: "iconfont";
}
.calender-Date-text {
  font-size: 0.3rem;
  font-weight: 800;
}
.calender-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.tem-wrapper {
  background: red;
}
.d {
  background: #4dc862;
  color: #fff;
}
.no-current-day {
  visibility: hidden;
}
.calender-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 1rem;
  align-items: center;
  width: 80%;
  margin: auto;
}
</style>
