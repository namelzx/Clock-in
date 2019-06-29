<template>
  <div>
    <list :MyList="MyList" :mytitle="mytitle" :iconfont="myiconfont"></list>
    <list :MyList="MyList" :mytitle="youtitle" :iconfont="youiconfont"></list>
   <div class="btn" @click="toAdd">创建打卡》</div>
  </div>
</template>

<script>
import List from "@cmpt/list/";
export default {
  components: {
    List
  },
  data() {
    return {
      myiconfont: "\ue665",
      youiconfont: "\ue62f",
      mytitle: "我的打卡",
      youtitle: "打卡活动",
      MyList: [
        {
            id:1,
          title: "轻课打卡每日读书打卡",
          desc: "5938人参与|5198次打卡",
          tx:
            "https://img.zcool.cn/community/011cff5c7e3893a801213f26f4fed1.jpg@1280w_1l_2o_100sh.jpg"
        },
        {
              id:2,
          title: "每日听力打卡",
          desc: "5938人参与|5198次打卡",
          tx:
            "https://img.zcool.cn/community/011cff5c7e3893a801213f26f4fed1.jpg@1280w_1l_2o_100sh.jpg"
        }
      ]
    };
  },
  methods:{
      toAdd(){
          this.$router.push({name:"Add"})
      }
  }
};
</script>
<style lang="scss" scoped>
.btn {
  position: fixed;
  bottom: 0px;
  position: fixed;
  width: 100%;
  margin: auto;
  text-align: center;
//   background: #39bafc;
  padding: 10px;
  color: #fff;
  font-size: 0.3rem;
  font-weight: 400;
  border-top: .001rem solid rgb(228, 226, 226);
  color: #39bafc;
  height: .6rem;
  display: flex;
  justify-content:center;
  align-items: center;
//   border-radius: 1rem;
//   margin-left: 2%;
}
</style>

