<template>
  <div class="app-container">
    <div class="table-tool">
      <el-form ref="searchForm" :inline="true" :rules="rules" :model="pagination" class="demo-form-inline">
        <el-form-item label="日志类型" prop="type">
          <el-select v-model="pagination.type" placeholder="请选择"
            ><el-option
              v-for="item in logTypes"
              :key="item.value"
              :label="item.des"
              :value="item.value"
            ></el-option
          ></el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit"><i class="iconfont icon-search"></i
        ></el-button>
        </el-form-item>
        <el-form-item>
          <el-tooltip content="详情" placement="bottom" effect="light">
        <el-button type="info" size="mini" @click="details"
          ><i class="iconfont icon-eye"></i
        ></el-button>
      </el-tooltip>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="tableData"
      ref="table"
      border
      v-loading="tableLoading"
      height="530px"
      highlight-current-row
      @current-change="rowHandleCurrentChange"
    >
      <el-table-column label="序号" type="index" width="55" align="center">
        <template slot-scope="scope">
          <span>{{
            (pagination.page - 1) * pagination.size + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="日志类型"></el-table-column>
      <el-table-column prop="title" label="日志标题"></el-table-column>
      <el-table-column prop="logTime" label="操作时间"></el-table-column>
      <el-table-column prop="userId" label="操作人"></el-table-column>
      <el-table-column prop="controller" label="控制器"></el-table-column>
      <el-table-column prop="action" label="操作"></el-table-column>
      <el-table-column prop="addTime" label="添加时间"></el-table-column>
      <el-table-column prop="upTime" label="修改时间"></el-table-column>
    </el-table>
    <div class="table-pager">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-sizes="[10, 20, 50, 100, 500]"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        background
      >
      </el-pagination>
    </div>

    <el-dialog
      :title="dialogParams.title"
      :visible.sync="dialogParams.visible"
      :width="dialogParams.width"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        v-show="dialogParams.type === 1 || dialogParams.type === 2"
      >
        <el-form-item label="id" prop="id">
          <el-input-number v-model="formData.id"></el-input-number>
        </el-form-item>
        <el-form-item label="日志类型" prop="type">
          <el-input-number v-model="formData.type"></el-input-number>
        </el-form-item>
        <el-form-item label="日志标题" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="日志内容" prop="content">
          <el-input v-model="formData.content"></el-input>
        </el-form-item>
        <el-form-item label="操作时间" prop="logTime">
          <el-date-picker
            v-model="formData.logTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作人" prop="userId">
          <el-select v-model="formData.userId" placeholder="请选择"
            ><el-option
              v-for="item in [1, 2, 3]"
              :key="item"
              :label="item"
              :value="item"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item label="控制器" prop="controller">
          <el-input v-model="formData.controller"></el-input>
        </el-form-item>
        <el-form-item label="操作" prop="action">
          <el-input v-model="formData.action"></el-input>
        </el-form-item>
        <el-form-item label="参数" prop="param">
          <el-input v-model="formData.param"></el-input>
        </el-form-item>
        <el-form-item label="添加时间" prop="addTime">
          <el-date-picker
            v-model="formData.addTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="修改时间" prop="upTime">
          <el-date-picker
            v-model="formData.upTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        v-show="dialogParams.type === 1 || dialogParams.type === 2"
      >
        <el-button @click="formClose">返 回</el-button>
        <el-button
          type="primary"
          @click="dialogParams.type === 1 ? addSubmit() : editSubmit()"
          >提 交</el-button
        >
      </span>

      <el-descriptions
        class="margin-top"
        border
        :column="2"
        v-show="dialogParams.type === 3"
      >
        <el-descriptions-item label="id">{{
          formData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="日志类型">{{
          formData.type
        }}</el-descriptions-item>
        <el-descriptions-item label="日志标题">{{
          formData.title
        }}</el-descriptions-item>
        <el-descriptions-item label="日志内容">{{
          formData.content
        }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{
          formData.logTime
        }}</el-descriptions-item>
        <el-descriptions-item label="操作人">{{
          formData.userId
        }}</el-descriptions-item>
        <el-descriptions-item label="控制器">{{
          formData.controller
        }}</el-descriptions-item>
        <el-descriptions-item label="操作">{{
          formData.action
        }}</el-descriptions-item>
        <el-descriptions-item label="参数">{{
          formData.param
        }}</el-descriptions-item>
        <el-descriptions-item label="添加时间">{{
          formData.addTime
        }}</el-descriptions-item>
        <el-descriptions-item label="修改时间">{{
          formData.upTime
        }}</el-descriptions-item>
      </el-descriptions>
      <span
        slot="footer"
        class="dialog-footer"
        v-show="dialogParams.type === 3"
      >
        <el-button @click="formClose" type="info">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/sys_log'
export default {

  name: 'sys_log',
  mounted() {
    this.getLogtype()
  },
  data() {
    return {
      tableData: [],
      tableLoading: false,
      dialogParams: {
        title: '',
        visible: false,
        width: '50%',
        type: 1//1为新增，2为修改，3为详情
      },
      formData: {
        id: '',
        type: '',
        title: '',
        content: '',
        logTime: '',
        userId: '',
        controller: '',
        action: '',
        param: '',
        addTime: '',
        upTime: '',
      },
      pagination: {
        size: 10,
        page: 1,
        total: 0,
        type: ''
      },
      rules: {
        type: [{ required: true, message: '日志类型不能为空', trigger: 'blur' }]
      },
      currentRow: null,
      dbTypes: [],
      logTypes: []
    }
  },
  methods: {
    formClose() {
      this.dialogParams.visible = false;
      this.$refs.editForm.resetFields()
      this.formData = this.$options.data().formData
    },
    add() {
      this.dialogParams.visible = true
      this.dialogParams.title = '新增'
      this.dialogParams.type = 1
      this.getDbProvider()
    },
    edit() {
      if (this.currentRow == null) {
        this.$message.warning('请选择一条数据')
        return
      }
      this.dialogParams.visible = true
      this.dialogParams.title = '编辑'
      this.dialogParams.type = 2
      let { id } = this.currentRow
      api.get(id).then((res) => {
        if (res.code === 1) {
          this.formData = res.data
        }
      })
    },
    details() {
      if (this.currentRow == null) {
        this.$message.warning('请选择一条数据')
        return
      }
      this.dialogParams.visible = true
      this.dialogParams.title = '详情'
      this.dialogParams.type = 3
      let { id } = this.currentRow
      api.get(id).then((res) => {
        if (res.code === 1) {
          this.formData = res.data

        }
      })
    },
    del() {
      if (this.currentRow == null) {
        this.$message.warning('请选择数据')
        return
      }
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        let { id } = this.currentRow
        api.del(id).then((res) => {
          if (res.code === 1) {
            this.$message.success('删除成功')
            this.list()
          }
        })
      });
    },
    list() {
      this.tableLoading = true
      api.listPager(this.pagination).then((res) => {
        if (res.code === 1) {
          this.pagination.total = res.data.total
          this.tableData = res.data.data
        }
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    getLogtype() {
      api.getLogType().then(res => {
        if (res.code === 1) {
          this.logTypes = res.data
        }
      })
    },
    addSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.formData.userId = this.$store.getters.userId
          api.insert(this.formData).then(res => {
            if (res.code === 1) {
              this.$message.success('添加成功')
              this.list()
              this.formClose()
            }
          })
        }
      })
    },
    editSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          api.update(this.formData).then(res => {
            if (res.code === 1) {
              this.$message.success('编辑成功')
              this.list()
              this.formClose()
            }
          })
        }
      })
    },
    handleSizeChange(val) {
      this.pagination.size = val
      this.list()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.list()
    },
    rowHandleCurrentChange(val) {
      this.currentRow = val;
    }
    ,onSubmit(){
      this.$refs.searchForm.validate(valid => {
        if (valid) {
          this.list()
        }
      })
      
    }
  }
}
</script>

<style>
</style>