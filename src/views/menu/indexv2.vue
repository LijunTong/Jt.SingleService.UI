<template>
  <div class="app-container">
    <div class="table-tool">
      <el-tooltip content="编辑" placement="bottom" effect="light">
        <el-button type="primary" size="mini" @click="edit"
          ><i class="iconfont icon-edit"></i
        ></el-button>
      </el-tooltip>
      <el-tooltip content="更新权限树" placement="bottom" effect="light">
        <el-button type="primary" size="mini" @click="initController"
          ><i class="iconfont icon-reload"></i
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
      row-key="path"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column label="序号" type="index" width="55" align="center">
        <template slot-scope="scope">
          <span>{{
            (pagination.page - 1) * pagination.size + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="meta.title" label="显示名称"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="redirect" label="跳转链接"></el-table-column>
      <el-table-column prop="meta.affix" label="固定">
        <template slot-scope="scope">
          <span>{{ scope.row.meta.affix === true ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="meta.icon" label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.meta.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="hidden" label="显示">
        <template slot-scope="scope">
          <span>{{ scope.row.hidden === true ? "否" : "是" }}</span>
        </template>
      </el-table-column>
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
        :model="formData"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        v-show="dialogParams.type === 1 || dialogParams.type === 2"
      >
        <el-form-item label="名称" prop="name"
          ><el-input v-model="formData.name"></el-input
        ></el-form-item>
        <el-form-item label="显示名称" prop="title"
          ><el-input v-model="formData.title"></el-input
        ></el-form-item>
        <el-form-item label="路径" prop="path"
          ><el-input v-model="formData.path"></el-input
        ></el-form-item>

        <el-form-item label="跳转链接" prop="redirect"
          ><el-input v-model="formData.redirect"></el-input
        ></el-form-item>
        <el-form-item label="图标" prop="icon"
          ><e-icon-picker ref="iconPicker" v-model="formData.icon"
        /></el-form-item>
        <el-form-item label="固定" prop="affix"
          ><el-radio v-model="formData.affix" :label="true">是</el-radio>
          <el-radio v-model="formData.affix" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="显示" prop="hidden">
          <el-radio v-model="formData.hidden" :label="true">是</el-radio>
          <el-radio v-model="formData.hidden" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="控制器" prop="controller"
          ><el-select v-model="formData.controller" placeholder="请选择">
            <el-option
              v-for="item in controllers"
              :key="item.name"
              :value="item.name"
              :label="item.name"
            ></el-option> </el-select
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
import * as api from '@/api/menu'
export default {
  name: 'menus',
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
        name: '',
        title: '',
        path: '',
        redirect: '',
        affix: false,
        icon: '',
        hidden: true,
        sortIndex: '',
        parentId: '',
        actionDes: [],
        controller: '无'
      },
      pagination: {
        size: 10,
        page: 1,
        total: 0
      },
      rules: {
        controller: [{ required: true, message: '控制器不能为空', trigger: 'blur' }]
      },
      currentRow: null,
      menus: [],
      menuType: [],
      controllers: []
    }
  },
  methods: {
    formClose() {
      this.dialogParams.visible = false;
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
      api.getMenu(this.currentRow.path).then(res => {
        if (res.code === 1) {
          this.formData.controller = res.data?.controller
          this.formData.name = this.currentRow.name
          this.formData.title = this.currentRow.meta.title
          this.formData.path = this.currentRow.path
          this.formData.redirect = this.currentRow.redirect
          this.formData.affix = this.currentRow.meta.affix === true
          this.formData.icon = this.currentRow.meta.icon
          if (this.currentRow.hidden) {
            this.formData.hidden = true
          }
          else {
            if (this.currentRow.hidden === false) {
              this.formData.hidden = false
            }
            else {
              this.formData.hidden = true
            }
          }
          this.getController()
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
      this.tableData = this.$router.options.routes
      this.tableData = this.tableData.filter(x => x.meta && x.meta.title)

      this.tableLoading = false
      // api.getMenuTreeWithAction().then(res => {
      //   if (res.code === 1) {
      //     this.tableData = res.data
      //   }
      //   this.tableLoading = false
      // }).catch(() => {
      //   this.tableLoading = false
      // })
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
          var data = {
            path : this.formData.path, 
            controller: this.formData.controller,
            title:this.formData.title
          }
          api.bindController(data).then(res => {
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
    getMenus() {
      api.list().then(res => {
        if (res.code === 1) {
          this.menus = []
          let menu = { id: 0, title: '无' }
          this.menus.push(menu)
          res.data.forEach(element => {
            this.menus.push({ id: element.id, title: element.title })
          });
        }
      })
    },
    getMenuType() {
      api.getMenuType().then(res => {
        if (res.code === 1) {
          this.menuType = []
          res.data.forEach(element => {
            this.menuType.push({ id: element.value, title: element.des })
          });
        }
      })
    },

    reload() {
      api.getMenuTree().then(res => {
        if (res.code === 1) {
          this.$store.dispatch('user/setMenus', res.data)
          this.$message.success("同步成功")
        }
      })
    },
    getController() {
      api.getController().then(res => {
        if (res.code === 1) {
          this.controllers = res.data
          this.controllers.push({
            id: 0,
            name: '无'
          })
        }
      })
    },
    initController() {
      api.initController().then(res => {
        if (res.code === 1) {
          this.$message.success("更新成功")
        }
      })
    }
  }
}
</script>
