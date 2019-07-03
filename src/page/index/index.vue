<template>
  <div style="margin-bottom:40px" v-show="show">
    <list :MyList="MyList" :mytitle="mytitle" :iconfont="myiconfont"></list>
    <list  :MyList="youList" :mytitle="youtitle" :iconfont="youiconfont"></list>
    <div  class="btn" @click="toAdd">创建打卡》</div>
  </div>
</template>

<script>
import { GetDataByList } from "@api/colck";
import { getDataByUser } from "@api/user";
import List from "@cmpt/list/";
import { Toast } from "vant";

export default {
  components: {
    List
  },

  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20
      },
      show:false,
      youList: [],
      myiconfont: "\ue665",
      youiconfont: "\ue62f",
      mytitle: "我的打卡",
      youtitle: "打卡活动",
      admin:2,
      MyList: [
      ]
    };
  },

  created() {
    Toast.loading({
      mask: true,
      message: "登陆中..."
    });
    this.admin=this.$store.state.userInfo.admin
    if (
      this.$route.query.user_id === undefined &&
      this.$store.state.user_id === 0
    ) {
      window.location.href = "http://clock.10huisp.com/";
    }
    if (this.$route.query.user_id > 0) {
      getDataByUser(this.$route.query.user_id).then(res => {
        this.$store.state.userInfo = res.data;
        this.$store.state.user_id = res.data.id;
      });
    }
    this.listQuery.user_id = this.$route.query.user_id;
    this.getDataList();
  },
  methods: {
    toAdd() {
      this.$router.push({ name: "Add" });
    },
    getDataList() {
      if(this.listQuery.user_id===undefined){
        this.listQuery.user_id=this.$store.state.user_id
      }
      GetDataByList(this.listQuery).then(res => {
        this.MyList = res.data.data.data;
        this.youList = res.data.DataNot.data;
        Toast.clear();
        this.show=true
      });
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
  border-top: 0.001rem solid rgb(228, 226, 226);
  color: #39bafc;
  height: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  //   border-radius: 1rem;
  //   margin-left: 2%;
}
</style>

