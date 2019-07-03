<template>
  <div class="add">
    <div class="add-items">
      <div class="title">活动标题</div>
      <div class="input">
        <input type="text" v-model="temp.title" placeholder="标题在10个字以内" />
      </div>
    </div>
    <div class="add-items">
      <div class="title">打卡活动说明</div>
      <div class="input">
        <textarea v-model="temp.desc" placeholder="活动说明在100字以内"></textarea>
      </div>
    </div>
    <div class="add-items">
      <div class="title">上传打卡活动封面(选填)</div>
      <div class="input">
        <van-uploader :after-read="onRead">
          <img v-if="temp.imaes_url" :src="temp.imaes_url" />
          <van-icon v-else name="plus" />
        </van-uploader>
      </div>
    </div>

    <div class="add-desc">
      <div class="title">发起打卡须知</div>
      <lu>
        <li>打卡活动我们将在3天内审核,审核通过后，您可在打卡主页找到自己发起的打卡</li>
        <li>发起成功后,您可将打卡日历详情发送到朋友圈,邀请其他人参与打卡</li>
      </lu>
    </div>

    <div class="btn" @click="handelPost">提交活动</div>
  </div>
</template>

<script>
import { PostDataByAdd } from "@api/colck";
import { upload } from "@api/upload";

import HZRecorder from "@util/HZRecorder";
import { Toast, InfiniteScroll } from "mint-ui";
import Vue from "vue";

import { Uploader } from "vant";

Vue.use(Uploader);

export default {
  data() {
    return {
      temp: {
        imaes_url: undefined,
        type: 1
      }
    };
  },
  mounted() {},
  methods: {
    handelPost() {
      var that = this;
      this.temp.user_id = this.$store.state.user_id;
      PostDataByAdd(this.temp).then(res => {
        Toast(res.data.msg);
        setTimeout(function() {
          that.$router.push({ name: "Index" });
        }, 2000);
      });
    },
    onRead(file) {
      upload(file).then(res => {
        this.temp.imaes_url = "http://clock.10huisp.com/" + res.data.path;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$background: #fff;
$color: #39bafc;
$fontSize: 0.3rem;
$typecolor: #e4e1e1;

.add-items >>> .input .van-uploader i {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-items >>> .input .van-uploader img {
  width: 200px;
  height: 100px;
}
.add-items >>> .van-uploader__wrapper {
  color: black;
}
.add-items >>> .input .van-icon-plus:before {
  font-size: 90px;
}
.add-items >>> .input .van-uploader {
  border: 1px solid $typecolor;
  color: $typecolor;
}
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
      margin-bottom: 0.3rem;
    }
    input {
      width: 100%;
      height: 0.5rem;
      border-bottom: 1px solid $typecolor;
      text-indent: 0.3rem;
      padding-top: 0.1rem;
      font-size: 0.3rem;
      color: black;
    }
    textarea {
      width: 100%;
      height: 1.5rem;
      border: 1px solid $typecolor;
      border-radius: 0.1rem;
      color: black;
      text-indent: 0.3rem;
      padding-top: 0.1rem;
      font-size: 0.3rem;
      resize: none;
    }
    ::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: #aaa;
      text-indent: 0.3rem;
      padding-top: 0.1rem;
      font-size: 0.3rem;
    }
  }
  .add-desc {
    display: flex;
    flex-direction: column;
    padding-bottom: 3rem;
    margin-top: 10px;
    .title {
      border-left: 4px solid #aaa;
      text-indent: 0.2rem;
    }
    lu {
      li {
        padding-top: 0.5rem;
        color: #aaa;
      }
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

