<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import {getDataByUser, getJssdk} from "@api/user";
  import wx from "weixin-js-sdk";

  const _this = wx;
  export default {
    name: "App",
    data() {
      return {
        show: false
      };
    },
    created(){

      this.fullPath = location.href;
      this.admin = this.$store.state.userInfo.admin;
      this.fullPath = location.href;
      if (
        this.$route.query.user_id === undefined &&
        this.$store.state.user_id === 0
      ) {

        if(this.$route.fullPath==='/schedule'){
            window.location.href =
            this.$store.state.url+"/?url=" + this.$route.fullPath;
          return false;
        }

        if (this.$route.query.id !== undefined) {
          window.location.href =
            this.$store.state.url+"/?url=" + this.$route.fullPath;
        } else {
          window.location.href =  this.$store.state.url;
        }
      }
      if (this.$route.query.user_id > 0) {
        getDataByUser(this.$route.query.user_id).then(res => {
          this.$store.state.userInfo = res.data;
          this.$store.state.user_id = res.data.id;
        });
      }


    },
    computed:{
        watchUser(){

          return this.$store.state.user_id;
        }
    },
   watch:{
     watchUser(user,newuser){
       if(user>0){
         this.show=true
         let Loading = document.getElementById("Loading");
         if (Loading != null) {
           document.body.removeChild(Loading);
         }
       }

     }
   }
  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    height: 100%;
    color: #2c3e50;
    font-size: 0.26rem;
  }
</style>


<style>
  #Loading {
    top: 50%;
    left: 50%;

    position: absolute;

    -webkit-transform: translateY(-50%) translateX(-50%);
    transform: translateY(-50%) translateX(-50%);
    z-index: 100;
  }

  @-webkit-keyframes ball-beat {
    50% {
      opacity: 0.2;

      -webkit-transform: scale(0.75);
      transform: scale(0.75);
    }
    100% {
      opacity: 1;

      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  @keyframes ball-beat {
    50% {
      opacity: 0.2;

      -webkit-transform: scale(0.75);
      transform: scale(0.75);
    }
    100% {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  .ball-beat > div {
    background-color: #279fcf;
    width: 10px;
    height: 10px;

    border-radius: 100% !important;
    margin: 2px;

    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    display: inline-block;
    -webkit-animation: ball-beat 0.7s 0s infinite linear;
    animation: ball-beat 0.7s 0s infinite linear;
  }

  .ball-beat > div:nth-child(2n-1) {
    -webkit-animation-delay: 0.35s !important;

    animation-delay: 0.35s !important;
  }
</style>
