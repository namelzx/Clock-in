<template>
  <div class="card">
    <div class="card-top">
      <div class="title">签到主题</div>
    </div>




    <div class="calender-content-wrapper">
     <div class="yy">

       <audio ref="player" v-if="voice" :src="voice.url" controls></audio><span>{{voice.time_len}}</span>
     </div>

      <div  class="hide-article-box" v-if="contentStatus" @click="contentStatus=!contentStatus">阅读全文</div>

      <div class="bodyFont clearfloat" id="bodyFont" ref="bodyFont" :class="{bodyHeight:contentStatus}">
        <!--<div class="yy msdesc" v-html="detail.data.zhuti_desc">-->
        <!--</div>-->
        <div class="vv" v-if="desc" v-html="desc"> </div>
        <span v-else>没有主题哦，可以自行输入签到内容</span>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    desc:String,
    voice: {
      type: Object,
      default() {
        return [];
      }
    }
  },
  data(){
    return{
      contentStatus:false,
      curHeight:0,
      bodyHeight:100,
    }
  },
  mounted(){
    setTimeout(()=>{
      this.contentToggle();
    },500)
  },
  methods:{
    contentToggle(){
      this.curHeight=this.$refs.bodyFont.offsetHeight;
      console.log(this.curHeight)
      if(this.curHeight>this.bodyHeight){

        this.contentStatus=true;
      }else{
        this.contentStatus=false;
      }
    },
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
    font-weight: 400;
   color: #868585;
    font-size: .25rem;
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


.bodyHeight{
  height:100px;
}
.contentToggle{
  height:10px;
  line-height:10px;
  text-align: center;
  color:red;
  /*border:1px solid red;*/
  border-radius: 5px;
  margin-bottom:30px;
}
.hide-article-box{
  position: absolute;
  margin-top: 30px;
  height: 30px;
  background: #fff;
  color: #000;
  width: 100%;
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  font-size: .3rem;
  margin-top: 60px;;
}
  .vv{
    /*border: 1px solid #aaa;*/
    border-radius: 3px;
    /*padding: 10px;*/
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: #6f6b6b;
    font-size: .28rem;
  }
  .yy{
    display: flex;
    align-items: center;
    width: 60px;
  }
</style>

