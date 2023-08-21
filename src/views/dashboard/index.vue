<template>
  <div class="app-container">
    <el-card>
      <el-alert
        title="single"
        type="info"
        description="单体应用框架"
        show-icon
        :closable="false"
      />
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
