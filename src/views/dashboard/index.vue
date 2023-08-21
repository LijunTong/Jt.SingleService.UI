<template>
  <div class="app-container">
    <el-card>
      <el-alert
        title="CMS"
        type="info"
        description="内容管理平台"
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
