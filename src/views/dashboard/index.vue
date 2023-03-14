<template>
  <div class="app-container">
    <el-card>
      <el-alert
        title="通用框架"
        type="info"
        description="后台管理"
        show-icon
        :closable="false"
      >
      </el-alert>
    </el-card>
    <!-- <el-card>
      <div slot="header" class="clearfix">
        <span>操作流程</span>
      </div>
      <el-steps align-center :active="5">
        <el-step title="创建数据源"></el-step>
        <el-step title="创建模板"></el-step>
        <el-step title="创建模板方案"></el-step>
        <el-step title="模板生成"></el-step>
      </el-steps>
    </el-card> -->
    
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  mounted() {
    this.init()
  },
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
