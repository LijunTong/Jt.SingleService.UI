<template>
  <div class="app-container">
    <div class="table-tool">
      <el-tooltip content="详情" placement="bottom" effect="light">
        <el-button
          type="info"
          size="mini"
          @click="details"
        ><i
          class="iconfont icon-eye"
        /></el-button>
      </el-tooltip>
      <el-tooltip content="添加" placement="bottom" effect="light">
        <el-button
          type="primary"
          size="mini"
          @click="add"
        ><i
          class="iconfont icon-plus"
        /></el-button>
      </el-tooltip>
      <el-tooltip content="编辑" placement="bottom" effect="light">
        <el-button
          type="primary"
          size="mini"
          @click="edit"
        ><i
          class="iconfont icon-edit"
        /></el-button>
      </el-tooltip>
      <el-tooltip content="删除" placement="bottom" effect="light">
        <el-button
          type="warning"
          size="mini"
          @click="del"
        ><i
          class="iconfont icon-delete"
        /></el-button>
      </el-tooltip>
      <el-tooltip content="分配权限" placement="bottom" effect="light">
        <el-button
          type="warning"
          size="mini"
          @click="bind"
        ><i
          class="iconfont icon-select"
        /></el-button>
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
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="code" label="角色代码" />
      <el-table-column prop="des" label="角色描述" />
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
          label="角色名称"
          prop="name"
        ><el-input
          v-model="formData.name"
        /></el-form-item>
        <el-form-item
          label="角色代码"
          prop="name"
        ><el-input
          v-model="formData.code"
        /></el-form-item>
        <el-form-item
          label="角色描述"
          prop="des"
        ><el-input
          v-model="formData.des"
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
        >提 交</el-button>
      </span>

      <el-descriptions
        v-show="dialogParams.type === 3"
        class="margin-top"
        border
        :column="2"
      >
        <el-descriptions-item label="ID">{{
          formData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{
          formData.name
        }}</el-descriptions-item>
        <el-descriptions-item label="代码">{{
          formData.code
        }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{
          formData.des
        }}</el-descriptions-item>
        <el-descriptions-item label="添加时间">{{
          formData.addTime
        }}</el-descriptions-item>
        <el-descriptions-item label="修改时间">{{
          formData.upTime
        }}</el-descriptions-item>
      </el-descriptions>
      <span
        v-show="dialogParams.type === 3"
        slot="footer"
        class="dialog-footer"
      >
        <el-button type="info" @click="formClose">确 认</el-button>
      </span>

      <el-table
        v-show="dialogParams.type === 4"
        ref="raTable"
        v-loading="actionsTableLoading"
        :data="menuActions"
        border
        height="400px"
        row-key="id"
        :default-expand-all="true"
      >
        <el-table-column prop="title" label="菜单">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.check"
              :indeterminate="scope.row.isIndeterminate"
              @change="(checked) => change(checked, scope.row)"
            >{{ scope.row.title }}</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-checkbox-group v-model="selectActions">
              <el-checkbox
                v-for="item in scope.row.actions"
                :key="item.controller + '-' + item.name"
                :label="item.controller + '-' + item.name"
                @change="actionChange()"
              >{{ item.text }}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
      </el-table>
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
import * as api from '@/api/role'
import { getMenuTreeWithAction } from '@/api/menu'
export default {
  name: 'Role',
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
        des: ''
      },
      pagination: {
        size: 10,
        page: 1,
        total: 0
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        des: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]

      },
      currentRow: null,
      actionsTableLoading: false,
      menuActions: [],
      selectActions: []
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
      this.menuActions = []
      this.selectActions = []
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
    bind() {
      if (this.currentRow == null) {
        this.$message.warning('请选择一条数据')
        return
      }
      this.dialogParams.visible = true
      this.dialogParams.title = '分配角色'
      this.dialogParams.type = 4
      const { id } = this.currentRow
      this.getMenuAction(id)
    },
    getMenuAction(id) {
      this.actionsTableLoading = true
      getMenuTreeWithAction().then(res => {
        if (res.code === 1) {
          this.menuActions = res.data

          this.getRoleActions(id)
        }
        this.actionsTableLoading = false
      }).catch(() => {
        this.actionsTableLoading = false
      })
    },
    getRoleActions(id) {
      const arr = []
      api.get(id).then(res => {
        if (res.code === 1) {
          const roleAction = res.data.roleActions
          console.log(roleAction)
          roleAction.forEach(e => {
            arr.push(e.controller + '-' + e.action)
          })
          this.selectActions = arr
          this.setIndeterminate(this.menuActions, this.selectActions)
        }
      })
    },
    setIndeterminate(menuActions, selectActions) {
      console.log(menuActions, selectActions)
      menuActions.forEach(menum => {
        const cnt = menum.actions.length
        const selectCnt = selectActions.filter(x => {
          if (menum.controller === '无') {
            return x.split('-')[0] === menum.name
          }
          return x.split('-')[0] === menum.controller
        }).length
        if (selectCnt > 0 && selectCnt < cnt) {
          menum.isIndeterminate = true
        } else if (selectCnt === 0) {
          menum.check = false
          menum.isIndeterminate = false
        } else {
          menum.isIndeterminate = false
          menum.check = true
        }
        if (menum.children.length > 0) {
          this.setIndeterminate(menum.children, selectActions)
        }
      })
    },
    bindSubmit() {
      const { id } = this.currentRow
      const arr = []
      this.selectActions.forEach(element => {
        const controller = element.split('-')[0]
        const action = element.split('-')[1]
        arr.push({
          controller,
          action
        })
      })
      const roleActions = {
        roleId: id,
        actions: arr
      }
      api.bindRoleAction(roleActions).then(res => {
        if (res.code === 1) {
          this.$message.success('分配成功')
          this.formClose()
        }
      })
    },
    change(checked, row) {
      row.check = checked
      row.isIndeterminate = false
      const arr = this.selectActions.filter(x => {
        if (row.controller === '无') {
          return x.split('-')[0] !== row.name
        }
        return x.split('-')[0] !== row.controller
      })
      this.selectActions = arr
      if (checked) { // 全选
        row.actions.forEach(e => {
          if (e.controller === '无') {
            this.selectActions.push(row.name + '-' + e.name)
          } else {
            this.selectActions.push(e.controller + '-' + e.name)
          }
        })
      }
    },
    actionChange() {
      this.setIndeterminate(this.menuActions, this.selectActions)
    }
  }
}
</script>

<style>
</style>
