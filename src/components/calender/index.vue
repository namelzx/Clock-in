<template>
  <calender
    @test1="test"
    :markArr="[
      {
        color:'#ffc518',
        name:'测试三',
        days:['2019-6-18','2019-6-11','2019-6-7','2019-6-4','2019-6-1','2019-7-18','2019-7-11','2019-7-7','2019-7-4','2019-7-1','2019-8-4','2019-8-1'],
        clickEvent:'test3'
      }
      ]"
  ></calender>
</template>

<script>
import calender from "./calender";
export default {
  name: "App",
  components: {
    calender
    // backwards
  },
  methods: {
    test(item) {
      console.log(item);
    }
  }
};
</script>
