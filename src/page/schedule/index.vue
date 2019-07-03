<template>
  <div>
    <div class="list">
      <div class="list-items">
        <div>开启学习提醒</div>
        <div class="switch">
          <van-switch v-model="temp.checked" />
        </div>
      </div>
      <div class="list-items" @click="show=true">
        <div>提醒时间</div>
        <div class="span">
          <span>{{temp.currentDate}}</span>
          <i class="iconfont">&#xe677;</i>
        </div>
      </div>
      <div class="list-items" @click="weeks=true">
        <div>重复</div>
        <div class="span">
          <div class="list" v-for="(item,sindex) in resultdata" :key="sindex">{{item.dname}}</div>
          <i class="iconfont">&#xe677;</i>
        </div>
      </div>
    </div>

    <van-popup v-model="show" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="time"
        @cancel="show=false"
        @confirm="handelremind"
      />
    </van-popup>
    <van-popup v-model="weeks" position="bottom">
      <van-checkbox-group v-model="result">
        <van-cell-group>
          <div class="che" v-for="(item,index) in list" :key="index">
            <div class="list-items">
              <div>{{item.dname}}</div>
              <div class="span">
                <van-checkbox :name="item.dvalue" ref="checkboxes" @click="toggle(item)" />
              </div>
            </div>
          </div>
        </van-cell-group>
      </van-checkbox-group>
    </van-popup>
  </div>
</template>

<script>
import { postSchedule, getSchedule } from "@api/schedule";
export default {
  data() {
    return {
      currentDate: "12:00",
      show: false,
      weeks: false,
      checked: true,
      result: [],
      resultdata: [],
      temp: {
        currentDate: "",
        result: [],
        checked: false,
        user_id: 2
      },
      list: [
        {
          dname: "周一",
          dvalue: "Tue"
        },
        {
          dname: "周二",
          dvalue: "Wed"
        },
        {
          dname: "周三",
          dvalue: "Thu"
        },
        {
          dname: "周四",
          dvalue: "Fri"
        },
        {
          dname: "周五",
          dvalue: "Sat"
        },
        {
          dname: "周六",
          dvalue: "Sun"
        },
        {
          dname: "周日",
          dvalue: "Mon"
        }
      ]
    };
  },
  created() {
    this.getScheduleData();
  },
  methods: {
    getScheduleData() {
      getSchedule(this.temp.user_id).then(res => {
        if (res.data.temp.checked === 1) {
          res.data.temp.checked = true;
        } else {
          res.data.temp.checked = false;
        }
        if(res.data.temp!==null){
        this.temp = res.data.temp;

        }

        this.resultdata = res.data.result;
        var arr = [];
        for (let index = 0; index < res.data.result.length; index++) {
          arr[index] = res.data.result[index].dvalue;
        }
        this.result = arr;
      });
    },
    handelremind(e) {
      this.temp.currentDate = e;
      this.show = false;
      this.postData();
    },
    toggle(index) {
      if (this.resultdata.indexOf(index) > -1 || this.resultdata.length > 0) {
        for (let i = 0; i < this.resultdata.length; i++) {
          if (this.resultdata[i].dvalue == index.dvalue) {
            this.resultdata.splice(i, 1);
            this.postData();
            return;
          }
        }
      }
     
      this.resultdata.push(index);
      this.postData();
    },
    postData() {
      this.temp.result = this.resultdata;
      postSchedule(this.temp).then(res => {
        console.log(res);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.list-items >>> .switch {
  margin-top: 0.1rem;
}
.list {
  display: flex;
  flex-direction: column;
  .list-items {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 1.5rem;
    align-items: center;
    width: 95%;
    margin: auto;
    font-size: 0.3rem;
    color: black;
    border-bottom: 1px solid #eae6e6;
    .span {
      color: #aaa;
      font-size: 0.5rem;
      display: flex;
      flex-direction: row;
      .list {
        font-size: 0.3rem;
        text-indent: 0.1rem;
      }
    }
  }
}

.che {
  display: flex;
  flex-direction: column;
  .list-items {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 1rem;
    align-items: center;
    width: 95%;
    margin: auto;
    font-size: 0.3rem;
    color: black;
    border-bottom: 1px solid #eae6e6;
    .span {
      color: #aaa;
      font-size: 0.5rem;
    }
  }
}
</style>

