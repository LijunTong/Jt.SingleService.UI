<template>
  <div class="app-container">
    <div class="table-tool">
      <el-tooltip content="详情" placement="bottom" effect="light">
        <el-button type="info" size="mini" @click="details"
          ><i class="iconfont icon-eye"></i
        ></el-button>
      </el-tooltip>
      <el-tooltip content="添加" placement="bottom" effect="light">
        <el-button type="primary" size="mini" @click="add"
          ><i class="iconfont icon-plus"></i
        ></el-button>
      </el-tooltip>
      <el-tooltip content="编辑" placement="bottom" effect="light">
        <el-button type="primary" size="mini" @click="edit"
          ><i class="iconfont icon-edit"></i
        ></el-button>
      </el-tooltip>
      <el-tooltip content="删除" placement="bottom" effect="light">
        <el-button type="warning" size="mini" @click="del"
          ><i class="iconfont icon-delete"></i
        ></el-button>
      </el-tooltip>
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
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="conStr" label="连接字符串"></el-table-column>
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
        <el-form-item label="类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择">
            <el-option
              v-for="item in dbTypes"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="名称" prop="name"
          ><el-input v-model="formData.name"></el-input
        ></el-form-item>
        <el-form-item label="连接字符串" prop="conStr"
          ><el-input v-model="formData.conStr"></el-input
        ></el-form-item>
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
        <el-descriptions-item label="名称">{{
          formData.name
        }}</el-descriptions-item>
        <el-descriptions-item label="连接字符串">{{
          formData.conStr
        }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{
          formData.type
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
import * as api from '@/api/code_db'
import { getDbProvider } from '@/api/code'
export default {
  name: 'db',
  mounted() {
    this.list()
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
        conStr: '',
        name: '',
        type: '',

      },
      pagination: {
        size: 10,
        page: 1,
        total: 0,
        userId: 0
      },
      rules: {
        conStr: [{ required: true, message: '连接字符串不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],

      },
      currentRow: null,
      dbTypes: []

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
          this.getDbProvider()
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
      this.currentRow = val;
    },
    getDbProvider() {
      getDbProvider().then(res => {
        if (res.code === 1) {
          this.dbTypes = res.data
        }
      })
    }
  }
}
</script>

<style>
</style>