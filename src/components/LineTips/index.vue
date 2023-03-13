<template>
  <div class="title">
    {{ tips }}
  </div>
</template>

<script>
export default {
  name: 'LineTips',
  props: {
    tips: {
      type: String,
      require: true
    }
  }
}
</script>

<style scoped>
.title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin-bottom: 5px;
  padding: 0px 10px;
}
</style>