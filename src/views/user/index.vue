<template>
  <div class="app-container">
    <div class="table-tool">
      <el-tooltip content="详情" placement="bottom" effect="light">
        <el-button type="info" size="mini" @click="details"
          ><i class="iconfont icon-eye"></i
        ></el-button>
      </el-tooltip>
      <el-tooltip content="分配角色" placement="bottom" effect="light">
        <el-button type="primary" size="mini" @click="bind"
          ><i class="iconfont icon-select"></i
        ></el-button>
      </el-tooltip>
      <!-- <el-button type="primary" size="mini" @click="add"
        ><i class="iconfont icon-plus"></i
      ></el-button>
      <el-button type="primary" size="mini" @click="edit"
        ><i class="iconfont icon-edit"></i
      ></el-button>
      <el-button type="warning" size="mini" @click="del"
        ><i class="iconfont icon-delete"></i
      ></el-button> -->
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
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="registerTime" label="注册时间"></el-table-column>
      <el-table-column prop="loginTime" label="登录时间"></el-table-column>
      <el-table-column prop="status" label="账号状态">
        <template slot-scope="scope">{{
          scope.row.status == 0 ? "正常" : "禁用"
        }}</template>
      </el-table-column>
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
        <el-form-item label="用户名" prop="userName"
          ><el-input v-model="formData.userName"></el-input
        ></el-form-item>
        <el-form-item label="密码" prop="password"
          ><el-input v-model="formData.password"></el-input
        ></el-form-item>
        <el-form-item label="注册时间" prop="registerTime"
          ><el-date-picker
            v-model="formData.registerTime"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker
        ></el-form-item>
        <el-form-item label="登录时间" prop="loginTime"
          ><el-date-picker
            v-model="formData.loginTime"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker
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
        <el-descriptions-item label="id">{{
          formData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{
          formData.userName
        }}</el-descriptions-item>
        <el-descriptions-item label="密码">{{
          formData.password
        }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{
          formData.registerTime
        }}</el-descriptions-item>
        <el-descriptions-item label="登录时间">{{
          formData.loginTime
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{
          formData.status
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

      <el-transfer
        :titles="['可分配角色', '已分配角色']"
        v-show="dialogParams.type === 4"
        v-model="selectRoles"
        :data="roles"
      ></el-transfer>
      <span
        slot="footer"
        class="dialog-footer"
        v-show="dialogParams.type === 4"
      >
        <el-button @click="formClose">返 回</el-button>
        <el-button type="primary" @click="bindSubmit()">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/user'
import { list as roleList } from '@/api/role'
export default {
  name: 'user',
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
        userName: '',
        password: '',
        registerTime: '',
        loginTime: '',
        status: '',
      },
      pagination: {
        size: 10,
        page: 1,
        total: 0
      },
      rules: {
        userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        registerTime: [{ required: true, message: '注册时间不能为空', trigger: 'blur' }],
        loginTime: [{ required: true, message: '登录时间不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '账号状态（0：正常,1：锁定，2：注销）不能为空', trigger: 'blur' }],
      },
      currentRow: null,
      roles: [],
      selectRoles: []
    }
  },
  methods: {
    formClose() {
      this.dialogParams.visible = false;
      this.$refs.editForm.resetFields()
      this.formData = this.$options.data().formData
      this.selectRoles = []
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
    bind() {
      if (this.currentRow == null) {
        this.$message.warning('请选择一条数据')
        return
      }
      this.dialogParams.visible = true
      this.dialogParams.title = '分配角色'
      this.dialogParams.type = 4
      this.getRole()
      let { id } = this.currentRow
      this.getUserRole(id)
    },
    getRole() {
      roleList().then(res => {
        const arr = [];
        if (res.code === 1) {
          res.data.forEach(element => {
            arr.push({
              key: element.id,
              label: element.name
            })
          });
        }
        this.roles = arr;
      })
    },
    getUserRole(userId) {
      api.get(userId).then(res => {
        const arr = []
        if (res.code === 1) {
          res.data.userRoles.forEach(element => {
            arr.push(element.roleId)
          });
        }
        this.selectRoles = arr
      })
    },
    bindSubmit() {
      let { id } = this.currentRow
      const arr = []
      this.selectRoles.forEach(element => {
        arr.push(element)
      })
      const userRoles = {
        userId : id,
        roleIds : arr
      }
      api.bindUserRole(userRoles).then(res => {
        if (res.code === 1) {
          this.$message.success('分配成功')
          this.formClose()
        }
      })
    }
  }
}
</script>

<style>
</style>