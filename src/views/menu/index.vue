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
      <!-- <el-tooltip content="同步" placement="bottom" effect="light">
        <el-button type="warning" size="mini" @click="reload"
          ><i class="iconfont icon-reload"></i
        ></el-button>
      </el-tooltip> -->
      <el-tooltip content="更新权限树" placement="bottom" effect="light">
        <el-button
          type="primary"
          size="mini"
          @click="initController"
        ><i class="iconfont icon-reload" /></el-button>
      </el-tooltip>
    </div>
    <el-table
      ref="table"
      v-loading="tableLoading"
      :data="tableData"
      border
      height="530px"
      highlight-current-row
      row-key="id"
      :tree-props="{ children: 'children' }"
      @current-change="rowHandleCurrentChange"
    >
      <el-table-column label="序号" type="index" width="55" align="center">
        <template slot-scope="scope">
          <span>{{
            (pagination.page - 1) * pagination.size + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="显示名称" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="redirect" label="跳转链接" />
      <el-table-column prop="affix" label="固定">
        <template slot-scope="scope">
          <span>{{ scope.row.affix ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="hidden" label="显示">
        <template slot-scope="scope">
          <span>{{ scope.row.hidden ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sortIndex" label="排序" />
    </el-table>

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
          label="名称"
          prop="name"
        ><el-input v-model="formData.name" /></el-form-item>
        <el-form-item
          label="显示名称"
          prop="title"
        ><el-input v-model="formData.title" /></el-form-item>
        <el-form-item
          label="路径"
          prop="path"
        ><el-input v-model="formData.path" /></el-form-item>

        <el-form-item
          label="跳转链接"
          prop="redirect"
        ><el-input v-model="formData.redirect" /></el-form-item>
        <el-form-item
          label="图标"
          prop="icon"
        ><e-icon-picker
          ref="iconPicker"
          v-model="formData.icon"
        /></el-form-item>
        <el-form-item
          label="固定"
          prop="affix"
        ><el-radio v-model="formData.affix" :label="true">是</el-radio>
          <el-radio v-model="formData.affix" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="显示" prop="hidden">
          <el-radio v-model="formData.hidden" :label="true">是</el-radio>
          <el-radio v-model="formData.hidden" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item
          label="排序"
          prop="url"
        ><el-input v-model="formData.sortIndex" /></el-form-item>
        <el-form-item
          label="类型"
          prop="type"
        ><el-select v-model="formData.type" placeholder="请选择">
          <el-option
            v-for="item in menuType"
            :key="item.id"
            :value="item.id"
            :label="item.title"
          /> </el-select></el-form-item>
        <el-form-item
          label="上级菜单"
          prop="parentId"
        ><el-select v-model="formData.parentId" placeholder="请选择">
          <el-option
            v-for="item in menus"
            :key="item.id"
            :value="item.id"
            :label="item.title"
          /> </el-select></el-form-item>
        <el-form-item
          label="控制器"
          prop="controller"
        ><el-select v-model="formData.controller" placeholder="请选择">
          <el-option
            v-for="item in controllers"
            :key="item.name"
            :value="item.name"
            :label="item.name"
          /> </el-select></el-form-item>

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
        <el-descriptions-item label="id">{{
          formData.id
        }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{
          formData.name
        }}</el-descriptions-item>
        <el-descriptions-item label="显示名称">{{
          formData.title
        }}</el-descriptions-item>
        <el-descriptions-item label="路径">{{
          formData.path
        }}</el-descriptions-item>
        <el-descriptions-item label="跳转链接">{{
          formData.redirect
        }}</el-descriptions-item>
        <el-descriptions-item label="固定">{{
          formData.affix
        }}</el-descriptions-item>
        <el-descriptions-item label="图标">{{
          formData.icon
        }}</el-descriptions-item>

        <el-descriptions-item label="显示">{{
          formData.hidden
        }}</el-descriptions-item>
        <el-descriptions-item label="排序">{{
          formData.sortIndex
        }}</el-descriptions-item>
        <el-descriptions-item label="上级菜单">{{
          formData.parentId
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
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/menu'
export default {
  name: 'Menus',
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
        title: '',
        path: '',
        redirect: '',
        affix: false,
        icon: '',
        hidden: true,
        sortIndex: '',
        parentId: '',
        actionDes: []
      },
      pagination: {
        size: 10,
        page: 1,
        total: 0
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '显示名称不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
        redirect: [{ required: true, message: '跳转链接不能为空', trigger: 'blur' }],
        affix: [{ required: true, message: '固定不能为空', trigger: 'blur' }],
        hidden: [{ required: true, message: '是否显示不能为空', trigger: 'blur' }],
        sortIndex: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        controller: [{ required: true, message: '控制器不能为空', trigger: 'blur' }]
      },
      currentRow: null,
      menus: [],
      menuType: [],
      controllers: []
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
      this.controllers = []
    },
    add() {
      this.dialogParams.visible = true
      this.dialogParams.title = '新增'
      this.dialogParams.type = 1
      this.getMenus()
      this.getMenuType()
      this.getController()
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
      this.getMenus()
      this.getMenuType()
      this.getController()
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
      api.getMenuTreeWithAction().then(res => {
        if (res.code === 1) {
          this.tableData = res.data
        }
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    addSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
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
    getMenus() {
      api.list().then(res => {
        if (res.code === 1) {
          this.menus = []
          const menu = { id: '', title: '无' }
          this.menus.push(menu)
          res.data.forEach(element => {
            this.menus.push({ id: element.id, title: element.title })
          })
        }
      })
    },
    getMenuType() {
      api.getMenuType().then(res => {
        if (res.code === 1) {
          this.menuType = []
          res.data.forEach(element => {
            this.menuType.push({ id: element.value, title: element.des })
          })
        }
      })
    },

    reload() {
      api.getMenuTree().then(res => {
        if (res.code === 1) {
          this.$store.dispatch('user/setMenus', res.data)
          this.$message.success('同步成功')
        }
      })
    },
    getController() {
      api.getController().then(res => {
        if (res.code === 1) {
          this.controllers = res.data
          this.controllers.push({
            id: '',
            name: '无'
          })
        }
      })
    },
    initController() {
      api.initController().then(res => {
        if (res.code === 1) {
          this.$message.success('更新成功')
        }
      })
    }
  }
}
</script>
