<template>
  <div class="app-container">
    <div class="table-tool">
      <el-tooltip content="详情" placement="bottom" effect="light">
        <el-button type="info" size="mini" @click="details"
          ><i class="iconfont icon-eye"
        /></el-button>
      </el-tooltip>
      <el-tooltip content="分配角色" placement="bottom" effect="light">
        <el-button type="primary" size="mini" @click="bind"
          ><i class="iconfont icon-select"
        /></el-button>
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
      <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <img class="cellImg" :src="getImgUrl(scope.row.avatar)"
        /></template>
      </el-table-column>
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="userName" label="角色">
        <template slot-scope="scope">
          <div v-for="(userRole, index) in scope.row.userRoles" :key="index">
            <el-tag>{{ userRole.role.name }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="registerTime" label="注册时间" />
      <el-table-column prop="loginTime" label="登录时间" />
      <el-table-column prop="status" label="账号状态">
        <template slot-scope="scope">{{
          scope.row.status == 0 ? "正常" : "禁用"
        }}</template>
      </el-table-column>
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
        <el-form-item label="用户名" prop="userName"
          ><el-input v-model="formData.userName"
        /></el-form-item>
        <el-form-item label="密码" prop="password"
          ><el-input v-model="formData.password"
        /></el-form-item>
        <el-form-item label="注册时间" prop="registerTime"
          ><el-date-picker
            v-model="formData.registerTime"
            type="datetime"
            placeholder="选择日期时间"
        /></el-form-item>
        <el-form-item label="登录时间" prop="loginTime"
          ><el-date-picker
            v-model="formData.loginTime"
            type="datetime"
            placeholder="选择日期时间"
        /></el-form-item>
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
          >提 交</el-button
        >
      </span>
      <el-descriptions
        v-show="dialogParams.type === 3"
        class="margin-top"
        :column="1"
        border
      >
        <el-descriptions-item label="头像">
          <img v-if="formData.avatar" :src="avatar" class="avatar">
        </el-descriptions-item>
        <el-descriptions-item label="用户名">{{
          formData.userName
        }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{
          formData.registerTime
        }}</el-descriptions-item>
        <el-descriptions-item label="上次登录时间">{{
          formData.loginTime
        }}</el-descriptions-item>
        <el-descriptions-item
          v-for="(userRole, index) in formData.userRoles"
          :key="index"
          label="角色"
        >
          <el-tag>{{ userRole.role.name }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="粉丝数">{{
          formData.followCount
        }}</el-descriptions-item>
      </el-descriptions>
      <span
        v-show="dialogParams.type === 3"
        slot="footer"
        class="dialog-footer"
      >
        <el-button type="info" @click="formClose">确 认</el-button>
      </span>

      <el-transfer
        v-show="dialogParams.type === 4"
        v-model="selectRoles"
        :titles="['可分配角色', '已分配角色']"
        :data="roles"
      />
      <span
        v-show="dialogParams.type === 4"
        slot="footer"
        class="dialog-footer"
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
  name: 'User',
  data() {
    return {
      tableData: [],
      tableLoading: false,
      dialogParams: {
        title: '',
        visible: false,
        width: '50%',
        type: 1 // 1为新增，2为修改，3为详情
      },
      formData: {
        userName: '',
        password: '',
        registerTime: '',
        loginTime: '',
        status: ''
      },
      pagination: {
        size: 10,
        page: 1,
        total: 0
      },
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        registerTime: [
          { required: true, message: '注册时间不能为空', trigger: 'blur' }
        ],
        loginTime: [
          { required: true, message: '登录时间不能为空', trigger: 'blur' }
        ],
        status: [
          {
            required: true,
            message: '账号状态（0：正常,1：锁定，2：注销）不能为空',
            trigger: 'blur'
          }
        ]
      },
      currentRow: null,
      roles: [],
      selectRoles: []
    }
  },
  computed: {
    // 计算属性的 getter
    avatar: function () {
      // `this` 指向 vm 实例
      return process.env.VUE_APP_BASE_API + this.formData.avatar
    }
  },
  mounted() {
    this.list()
  },
  methods: {
    getImgUrl(img) {
      return process.env.VUE_APP_BASE_API + img
    },
    formClose() {
      this.dialogParams.visible = false
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
      const { id } = this.currentRow
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
      api
        .listPager(this.pagination)
        .then((res) => {
          if (res.code === 1) {
            this.pagination.total = res.data.total
            this.tableData = res.data.data
          }
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    addSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.formData.userId = this.$store.getters.userId
          api.insert(this.formData).then((res) => {
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
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          api.update(this.formData).then((res) => {
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
    bind() {
      if (this.currentRow == null) {
        this.$message.warning('请选择一条数据')
        return
      }
      this.dialogParams.visible = true
      this.dialogParams.title = '分配角色'
      this.dialogParams.type = 4
      this.getRole()
      const { id } = this.currentRow
      this.getUserRole(id)
    },
    getRole() {
      roleList().then((res) => {
        const arr = []
        if (res.code === 1) {
          res.data.forEach((element) => {
            arr.push({
              key: element.id,
              label: element.name
            })
          })
        }
        this.roles = arr
      })
    },
    getUserRole(userId) {
      api.get(userId).then((res) => {
        const arr = []
        if (res.code === 1) {
          console.log(res.data)
          res.data.userRoles.forEach((element) => {
            arr.push(element.roleId)
          })
        }
        this.selectRoles = arr
      })
    },
    bindSubmit() {
      const { id } = this.currentRow
      const arr = []
      this.selectRoles.forEach((element) => {
        arr.push(element)
      })
      const userRoles = {
        userId: id,
        roleIds: arr
      }
      api.bindUserRole(userRoles).then((res) => {
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
.avatar {
  width: 10em;
  height: 10em;
  display: block;
}
.cellImg {
  width: 3em;
  height: 3em;
  display: block;
}
</style>
