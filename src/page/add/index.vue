<template>
  <div class="add">
    <div class="add-items">
      <div class="title">活动标题</div>
      <div class="input">
        <input type="text" placeholder="标题在10个字以内">
      </div>
    </div>
    <div class="add-items">
      <div class="title">打卡活动说明</div>
      <div class="input">
        <textarea placeholder="活动说明在100字以内"></textarea>
      </div>
    </div>
    <div class="add-items">
      <div class="title">上传打卡活动封面(选填)</div>
      <div class="input">
        <textarea placeholder="活动说明在100字以内"></textarea>
      </div>
    </div>
    <audio autoplay></audio>

    <div class="btn">提交活动</div>
  </div>
</template>

<script>
import HZRecorder from "@util/HZRecorder";
export default {
  mounted() {
    this.$nextTick(() => {
      try {
	// 检查是否能够调用麦克风

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia =
          navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        audio_context = new AudioContext();
        console.log(
          "navigator.getUserMedia " +
            (navigator.getUserMedia ? "available." : "not present!")
        );
      } catch (e) {
        alert("No web audio support in this browser!");
      }

      navigator.getUserMedia(
        { audio: true },
        function(stream) {
          recorder = new HZRecorder(stream);
          console.log("初始化完成");
        },
        function(e) {
          console.log("No live audio input: " + e);
        }
      );
    });
  },
  methods:{
      readyOriginal () {
			if (!this.isVoice) {
				recorder && recorder.start();
				this.isVoice = true
			} else {
				this.isVoice = false
				recorder && recorder.stop();
				setTimeout(()=> {
					var mp3Blob = recorder.upload();
					var fd = new FormData();
					fd.append('audio', mp3Blob);
					this.$http({
						header: ({
							'Content-Type': 'application/x-www-form-urlencodeed'
						}),
						method: 'POST',
						url: 'url',
						data: fd,
						withCredentials: true,
					}).then((res) => { 
						//  这里做登录拦截
						if (res.data.isLogin === false) {
							router.replace('/login');
						} else {
							if (res.data.status === 200) {
								console.log('保存成功')
							} else {
								this.returnmsg = '上传失败'
							}
						}
					})
				},1000)
			}
		},
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

