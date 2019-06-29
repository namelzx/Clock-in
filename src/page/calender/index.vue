<template>
  <div class="calender">
    <div class="head">
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
    </div>
    <calender
      @test1="test"
      :markArr="[
      {
            id:1,
        color:'#ffc518',
        name:'测试三',
        days:'2019-6-18',
        clickEvent:'test3'
      },
       {
            id:10,
        color:'#ffc518',
        name:'测试1',
        days:'2019-6-11',
        clickEvent:'test3'
      },
       {
           id:9,
        color:'#ffc518',
        name:'测试8',
        days:'2019-6-13',
        clickEvent:'test3'
      },
       {
         id:8,
        color:'#ffc518',
        name:'测试8',
        days:'2019-6-19',
        clickEvent:'test3'
      }
      ]"
    ></calender>
  </div>
</template>

<script>
import calender from "@cmpt/calender/calender";
export default {
  name: "App",
  components: {
    calender
    // backwards
  },
  methods: {
    test(item) {
    }
  }
};
</script>
<style>
.calender {
  height: 100%;
  background: #f8f8f8;
 
background: linear-gradient(to top,#fff, #f8f8f8); /* 标准的语法（必须放在最后） */
}
.head{
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
 box-shadow: 0px 1px 4px rgba(0,0,0,0.3),
				0px 0px 15px rgba(0,0,0,0.1) inset;
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

