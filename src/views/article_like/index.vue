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
      <el-table-column prop="articleId" label="文章id" />
      <el-table-column prop="likeTime" label="点赞时间" />
      <el-table-column prop="userId" label="作者id" />
      <el-table-column prop="isLike" label="是否点赞 0：不是，1：是" />
      <el-table-column prop="creater" label="添加人" />
      <el-table-column prop="createTime" label="添加时间" />
      <el-table-column prop="updater" label="最后修改人" />
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
        <el-form-item label="文章id" prop="articleId">
          <el-select v-model="formData.articleId" placeholder="请选择"><el-option v-for="item in [1,2,3]" :key="item" :label="item" :value="item" /></el-select>
        </el-form-item>
        <el-form-item label="点赞时间" prop="likeTime">
          <el-date-picker v-model="formData.likeTime" type="datetime" placeholder="选择日期时间" />
        </el-form-item>
        <el-form-item label="作者id" prop="userId">
          <el-select v-model="formData.userId" placeholder="请选择"><el-option v-for="item in [1,2,3]" :key="item" :label="item" :value="item" /></el-select>
        </el-form-item>
        <el-form-item label="是否点赞 0：不是，1：是" prop="isLike">
          <el-input-number v-model="formData.isLike" />
        </el-form-item>
        <el-form-item label="添加人" prop="creater">
          <el-input v-model="formData.creater" />
        </el-form-item>
        <el-form-item label="添加时间" prop="createTime">
          <el-date-picker v-model="formData.createTime" type="datetime" placeholder="选择日期时间" />
        </el-form-item>
        <el-form-item label="最后修改人" prop="updater">
          <el-input v-model="formData.updater" />
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
        <el-descriptions-item label="文章id">{{ formData.articleId }}</el-descriptions-item>
        <el-descriptions-item label="点赞时间">{{ formData.likeTime }}</el-descriptions-item>
        <el-descriptions-item label="作者id">{{ formData.userId }}</el-descriptions-item>
        <el-descriptions-item label="是否点赞 0：不是，1：是">{{ formData.isLike }}</el-descriptions-item>
        <el-descriptions-item label="添加人">{{ formData.creater }}</el-descriptions-item>
        <el-descriptions-item label="添加时间">{{ formData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="最后修改人">{{ formData.updater }}</el-descriptions-item>
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
import * as api from '@/api/article_like'
export default {
  name: 'ArticleLike',
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
        articleId: '',
        likeTime: '',
        userId: '',
        isLike: '',
        creater: '',
        createTime: '',
        updater: ''
      },
      pagination: {
        size: 10,
        page: 1,
        total: 0
      },
      rules: {
        articleId: [{ required: true, message: '文章id不能为空', trigger: 'blur' }],
        likeTime: [{ required: true, message: '点赞时间不能为空', trigger: 'blur' }],
        userId: [{ required: true, message: '作者id不能为空', trigger: 'blur' }],
        isLike: [{ required: true, message: '是否点赞 0：不是，1：是不能为空', trigger: 'blur' }],
        creater: [{ required: true, message: '添加人不能为空', trigger: 'blur' }],
        createTime: [{ required: true, message: '添加时间不能为空', trigger: 'blur' }],
        updater: [{ required: true, message: '最后修改人不能为空', trigger: 'blur' }]
      },
      currentRow: null,
      dbTypes: []

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
    }
  }
}
</script>

<style>
</style>
