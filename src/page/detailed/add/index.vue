<template>
  <div class="add">
    <div class="add-items">
      <div class="title">签到活动说明</div>
      <div class="input">
        <textarea v-model="temp.desc" placeholder="写点什么吧～ (500字以内)"></textarea>
      </div>
    </div>
    <div class="btn" @click="handelPost">提交活动</div>
  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor'

import { Toast, InfiniteScroll } from "mint-ui";
import { PostDataByAdd } from "@api/sign";

export default {
  data() {
    return {
      temp: {},
      id: 0
    };
  },
  created() {
    this.id = this.$route.params.id;
  },
  mounted() {
   
  },
  methods: {
    handelPost() {
      var that = this;
      this.temp.user_id = this.$store.state.user_id;
      this.temp.zhuti_id = this.id;
      let date = new Date();
      this.temp.days =
        date.getFullYear() +
        "-" +
        parseInt(date.getMonth() + 1) +
        "-" +
        date.getDate();
      PostDataByAdd(this.temp).then(res => {
        Toast(res.data.msg);
        setTimeout(function() {
          that.$router.push({
            path: "/detailed",
            query: {
              id: that.id
            }
          });
        }, 2000);
      });
     
    },
    readyOriginal() {
      if (!this.isVoice) {
        recorder && recorder.start();
        this.isVoice = true;
      } else {
        this.isVoice = false;
        recorder && recorder.stop();
        setTimeout(() => {
          var mp3Blob = recorder.upload();
          var fd = new FormData();
          fd.append("audio", mp3Blob);
          this.$http({
            header: {
              "Content-Type": "application/x-www-form-urlencodeed"
            },
            method: "POST",
            url: "url",
            data: fd,
            withCredentials: true
          }).then(res => {
            //  这里做登录拦截
            if (res.data.isLogin === false) {
              router.replace("/login");
            } else {
              if (res.data.status === 200) {
                console.log("保存成功");
              } else {
                this.returnmsg = "上传失败";
              }
            }
          });
        }, 1000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$background: #fff;
$color: #39bafc;
$fontSize: 0.25rem;
$typecolor: #e4e1e1;

.add {
  background: $background;
  margin: 0.3rem;
  .add-items {
    display: flex;
    flex-direction: column;
    color: $color;
    font-size: $fontSize;
    margin-bottom: 0.4rem;
    .title {
      margin-bottom: 0.1rem;
    }
    input {
      width: 100%;
      height: 0.5rem;
      border-bottom: 1px solid $typecolor;
    }
    textarea {
      width: 100%;
      height: 1.5rem;
      border: 1px solid $typecolor;
      border-radius: 0.1rem;
    }
    ::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: #aaa;
      text-indent: 0.3rem;
      padding-top: 0.1rem;
      font-size: 0.2rem;
    }
  }
}
.btn {
  bottom: 10px;
  position: fixed;
  position: fixed;
  width: 87%;
  margin: auto;
  text-align: center;
  background: #39bafc;
  padding: 10px;
  color: #fff;
  font-size: 0.3rem;
  font-weight: 800;
  border-radius: 1rem;
}
</style>

