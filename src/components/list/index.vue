<template>
  <div class="conetn">
    <div class="top-title">
      <i class="iconfont">{{iconfont}}</i>
      {{mytitle}}
    </div>
    <div class="list">
      <div
        class="list-items"
        v-for="(item,index) in MyList"
        :key="index"

      >

        <div class="list-tx">
          <img :src="item.ico"  @click="handelUrl(item.id)"/>
        </div>
        <div class="lsit-desc" @click="handelUrl(item.id)">
          <div class="title">{{item.title}}</div>
          <div class="desc">{{item.get_sign_count.length}}人参与|{{item.get_sign.length}}打卡</div>
        </div>
        <div class="arr">
          <span  @click="totheme(item.id)">编辑</span>
          <i class="iconfont">&#xe617;</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    iconfont: String,
    mytitle: String,
    admin:false,
    MyList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  created() {
    if(this.$store.state.userInfo.admin==1){
      this.admin=true
    }else{
      this.admin=false
    }
    // console.log(this.$store.state.userInfo)
    //
    // console.log(this.mytitle);
  },
  data() {
    return {
      detailes: {
        tx:
          "https://img.zcool.cn/community/011cff5c7e3893a801213f26f4fed1.jpg@1280w_1l_2o_100sh.jpg"
      }
    };
  },
  methods: {
    totheme(id){
      this.$router.push({
        path: "/add",
        query: {
          id
        }
      });
    },
    handelUrl(id) {
      this.$router.push({
        path: "/detailed",
        query: {
          id
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$fontColor: #b1aeae;
$background: #fff;
$backgroundconent: #f6f6f6;
.iconfont {
  margin-right: 0.1rem;
}
.desc >>> .iconfont {
  font-size: 13px;
}
.conetn {
  // margin: 0.4rem;
  background: $background;
  .top-title {
    width: 97%;
    margin: auto;
    height: 0.8rem;
    text-indent: 0.2rem;
    display: flex;
    align-items: center;
  }
}
.list {
  // padding: 0.3rem;
  min-height: 1rem;
  display: flex;
  flex-direction: column;
  margin-top: 0.2rem;
  align-items: center;
  margin-bottom: 0.2rem;
  width: 97%;
  margin: auto;
  .list-items {
    justify-content: space-between;
    background: $background;
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-bottom: 0.2rem;
    height: 1.7rem;
    align-items: center;
    box-shadow: 0 0 39px 3px #ebebec;
    .list-tx {
      img {
        margin-right: 0.3rem;
        width: 1rem;
        height: 1rem;
        border-radius: 100%;
        margin-left: 0.2rem;

      }
    }
    .arr{
      display: flex;
      flex-direction: row;
      width: 20%;
    }
    .lsit-desc {
      color: black;
      font-size: 0.34rem;
      width: 80%;
      // font-weight: 800;
      .desc {
        color: $fontColor;
        font-weight: 400;
        font-size: 0.25rem;
      }
    }
  }
}

</style>

