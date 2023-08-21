<template>
  <div class="app-container">
    <div class="table-tool">
      <el-tooltip content="详情" placement="bottom" effect="light">
        <el-button
          type="info"
          size="mini"
          @click="details"
        ><i class="iconfont icon-eye" /></el-button>
      </el-tooltip>
      <el-tooltip content="添加" placement="bottom" effect="light">
        <el-button
          type="primary"
          size="mini"
          @click="add"
        ><i class="iconfont icon-plus" /></el-button>
      </el-tooltip>
      <el-tooltip content="编辑" placement="bottom" effect="light">
        <el-button
          type="primary"
          size="mini"
          @click="edit"
        ><i class="iconfont icon-edit" /></el-button>
      </el-tooltip>
      <el-tooltip content="删除" placement="bottom" effect="light">
        <el-button
          type="warning"
          size="mini"
          @click="del"
        ><i class="iconfont icon-delete" /></el-button>
      </el-tooltip>
    </div>
    <el-table
      ref="table"
      v-loading="tableLoading"
      :data="tableData"
      border
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
      <el-table-column prop="name" label="模板名称" />
    </el-table>
    <div class="table-pager">
      <el-pagination
        :current-page="pagination.page"
        :page-sizes="[10, 20, 50, 100, 500]"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
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
        v-show="dialogParams.type === 1 || dialogParams.type === 2"
        ref="editForm"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="模板名称"
          prop="name"
        ><el-input v-model="formData.name" /></el-form-item>
        <el-form-item>
          <el-collapse>
            <el-collapse-item title="模板占位符">
              <div v-for="(item, index) in placeholder" :key="index">
                <el-link
                  v-clipboard:copy="item.name"
                  v-clipboard:success="copySuccess"
                  type="info"
                >{{ item.name }}<i class="iconfont icon-file-copy" />
                </el-link>
                <label class="font-red">{{ item.des }}</label>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>
        <el-form-item label="正文" prop="tempContent">
          <el-input
            ref="content"
            v-model="formData.tempContent"
            type="textarea"
            :autosize="{ minRows: 20, maxRows: 20 }"
          />
        </el-form-item>
      </el-form>
      <span
        v-show="dialogParams.type === 1 || dialogParams.type === 2"
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="formClose">返 回</el-button>
        <el-button
          type="primary"
          @click="dialogParams.type === 1 ? addSubmit() : editSubmit()"
        >提 交</el-button>
      </span>

      <el-descriptions
        v-show="dialogParams.type === 3"
        class="margin-top"
        border
        :column="1"
      >
        <el-descriptions-item label="模板名称">{{
          formData.name
        }}</el-descriptions-item>
        <el-descriptions-item label="模板内容">
          <el-input
            v-model="formData.tempContent"
            type="textarea"
            :autosize="{ minRows: 20, maxRows: 20 }"
          />
        </el-descriptions-item>
      </el-descriptions>
      <span
        v-show="dialogParams.type === 3"
        slot="footer"
        class="dialog-footer"
      >
        <el-button type="info" @click="formClose">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/code_temp'
export default {
  name: 'CodeTemp',
  data() {
    return {
      tableData: [],
      tableLoading: false,
      dialogParams: {
        title: '',
        visible: false,
        width: '50%',
        type: 1// 1为新增，2为修改，3为详情
      },
      formData: {
        name: '',
        tempContent: ''
      },
      pagination: {
        size: 10,
        page: 1,
        total: 0,
        userId: 0
      },
      currentRow: null,
      rules: {
        name: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
        tempContent: [{ required: true, message: '模板内容不能为空', trigger: 'blur' }]
      },
      placeholder: [
        { name: '@(Model.TableName)', des: '字符串类型，数据库表名称' },
        { name: '@(Model.ClassName)', des: '字符串类型，实体类名称' },
        { name: '@(Model.DbFieldInfos)', des: '数据类型，数据库表结构，字段列表，可用遍历获取字段信息' },
        { name: '@(Model.DbFieldInfos[i].FieldName)', des: '字符串类型，数据库字段名称-下划线命名' },
        { name: '@(Model.DbFieldInfos[i].FieldModelName)', des: '字符串类型，实体类属性名称-Pascal命名' },
        { name: '@(Model.DbFieldInfos[i].FieldModelNameCamel)', des: '字符串类型，实体类属性名称-驼峰命名' },
        { name: '@(Model.DbFieldInfos[i].FieldDbType)', des: '字符串类型，数据库字段类型' },
        { name: '@(Model.DbFieldInfos[i].FieldModelType)', des: '字符串类型，实体类属性类型' },
        { name: '@(Model.DbFieldInfos[i].FieldLength)', des: '数值类型，数据库字符串类型字段长度' },
        { name: '@(Model.DbFieldInfos[i].IsNotNull)', des: '字符串类型，数据库字段是否允许为空，YES：允许为空，NO：不能为空' },
        { name: '@(Model.DbFieldInfos[i].IsIncrement)', des: '数值类型，数据库数值类型是否自增，1：自增，0：不自增' },
        { name: '@(Model.DbFieldInfos[i].IsPrimaryKey)', des: '数值类型，数据库数值类型是否主键，1：主键，0：非主键' },
        { name: '@(Model.DbFieldInfos[i].FieldDes)', des: '字符串类型，数据库字段描述' },
        { name: '@(Model.DbFieldInfos[i].DefaultValue)', des: '字符串类型，数据库字段默认值' }
      ]
    }
  },
  mounted() {
    this.list()
  },
  methods: {
    formClose() {
      this.dialogParams.visible = false
      this.$refs.editForm.clearValidate()
      this.formData = this.$options.data().formData
    },
    add() {
      this.dialogParams.visible = true
      this.dialogParams.title = '新增'
      this.dialogParams.type = 1
    },
    edit() {
      if (this.currentRow == null) {
        this.$message.warning('请选择一条数据')
        return
      }
      this.dialogParams.visible = true
      this.dialogParams.title = '编辑'
      this.dialogParams.type = 2
      const { id } = this.currentRow

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
      const { id } = this.currentRow
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
        const { id } = this.currentRow
        api.del(id).then((res) => {
          if (res.code === 1) {
            this.$message.success('删除成功')
            this.list()
          }
        })
      })
    },
    list() {
      this.tableLoading = true
      const userId = this.$store.getters.userId
      this.pagination.userId = userId
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
      this.currentRow = val
    },
    copySuccess() {
      this.$message.info('复制成功')
    }
  }
}
</script>
