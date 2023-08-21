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
      <el-table-column prop="name" label="方案名称" />
      <el-table-column prop="des" label="描述" />
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
          label="方案名称"
          prop="name"
        ><el-input v-model="formData.name" /></el-form-item>
        <el-form-item
          label="描述"
          prop="des"
        ><el-input v-model="formData.des" /></el-form-item>
        <el-form-item label="模板">
          <el-table
            ref="tempTable"
            :data="temps"
            tooltip-effect="dark"
            style="width: 100%"
            height="340px"
            border
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="模板名称" />
            <el-table-column label="文件名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.fileName" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="占位符:">
          <el-link
            v-clipboard:copy="placeholderClassName"
            v-clipboard:success="copySuccess"
            type="info"
          >{{ placeholderClassName }}<i class="iconfont icon-file-copy" /></el-link>

          <label
            class="font-red"
          >（文件名站位符在生成代码文件时会用实体类名称替换占位符）</label>
        </el-form-item>

        <el-form-item label="占位符:">
          <el-link
            v-clipboard:copy="placeholderDbName"
            v-clipboard:success="copySuccess"
            type="info"
          >{{ placeholderDbName }}<i class="iconfont icon-file-copy" /></el-link>

          <label
            class="font-red"
          >（数据库表名站位符在生成代码文件时会用实体类名称替换占位符）</label>
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
        :column="2"
      >
        <el-descriptions-item label="方案名称">{{
          formData.name
        }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{
          formData.des
        }}</el-descriptions-item>
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
import * as api from '@/api/code_gen_scheme'
import * as tempApi from '@/api/code_temp'

export default {
  name: 'CodeGenScheme',
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
        des: '',
        name: ''

      },
      pagination: {
        size: 10,
        page: 1,
        total: 0,
        userId: 0
      },
      currentRow: null,
      rules: {
        des: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '方案名称不能为空', trigger: 'blur' }],
        userId: [{ required: true, message: '用户id不能为空', trigger: 'blur' }]

      },
      tempIds: [],
      temps: [],
      placeholderClassName: '{ClassName}',
      placeholderDbName: '{TableName}'
    }
  },
  mounted() {
    this.list()
  },
  methods: {
    formClose() {
      this.dialogParams.visible = false
      this.$refs.editForm.resetFields()
      this.formData = this.$options.data().formData
      this.tempIds = this.$options.data().tempIds
    },
    add() {
      this.dialogParams.visible = true
      this.dialogParams.title = '新增'
      this.dialogParams.type = 1
      const userId = this.$store.getters.userId
      this.getTemps(userId)
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

      this.getSchemeDetials(id)
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
        this.$message.warning('请选择一条数据')
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
          const temps = this.$refs.tempTable.selection
          if (temps.length === 0) {
            this.$message.warning('请先选择模板')
            return
          }
          const fileNames = []
          for (let index = 0; index < temps.length; index++) {
            const x = temps[index]
            if (x.fileName === null || x.fileName === '') {
              this.$message.warning(x.name + '文件名称为空')
              return
            }
            if (fileNames.indexOf(x.fileName) > -1) {
              this.$message.warning(x.fileName + '文件名称重复')
              return
            }
            fileNames.push(x.fileName)
          }
          const data = { CodeGenScheme: this.formData, Temps: temps }
          api.insert(data).then(res => {
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
          const temps = this.$refs.tempTable.selection
          if (temps.length === 0) {
            this.$message.warning('请先选择模板')
            return
          }
          const fileNames = []
          for (let index = 0; index < temps.length; index++) {
            const x = temps[index]
            if (x.fileName === null || x.fileName === '') {
              this.$message.warning(x.name + '文件名称为空')
              return
            }
            if (fileNames.indexOf(x.fileName) > -1) {
              this.$message.warning(x.fileName + '文件名称重复')
              return
            }
            fileNames.push(x.fileName)
          }
          const data = { CodeGenScheme: this.formData, Temps: temps }
          api.insert(data).then(res => {
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
    getTemps(userId) {
      tempApi.list(userId).then(res => {
        if (res.code === 1) {
          this.temps = res.data
        }
      })
    },
    getSchemeDetials(schemeId) {
      const userId = this.$store.getters.userId
      tempApi.list(userId).then(res => {
        if (res.code === 1) {
          this.temps = res.data
          api.getSchemeDetials(schemeId).then(res => {
            if (res.code === 1) {
              this.formData = res.data
              this.temps.forEach(x => {
                const match = res.data.codeSchemeDetials.filter(o => o.tempId === x.id)
                if (match.length > 0) {
                  x.fileName = match[0].fileName
                  this.$refs.tempTable.toggleRowSelection(x, true)
                }
              })
            }
          })
        }
      })
    },
    copySuccess() {
      this.$message.info('复制成功')
    }
  }
}
</script>

<style>
</style>
