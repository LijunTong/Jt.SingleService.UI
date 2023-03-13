<template>
  <div class="app-container">
    <el-card shadow="hover">
      <el-form
        ref="codeForm"
        label-position="right"
        label-width="100px"
        :inline="true"
      >
        <el-form-item label="数据源" class="form-last-item">
          <el-select v-model="dataSourceSelVal" placeholder="请选择">
            <el-option
              v-for="item in dataSource"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              clearable
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-last-item">
          <el-button
            type="primary"
            @click="handClickConnect"
            :loading="connectLoading"
            >连接</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-form
        ref="codeGenForm"
        label-position="right"
        :model="codeDbForm"
        label-width="100px"
        :rules="rules"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="数据库" prop="databaseSelVal">
              <el-select
                v-model="codeDbForm.databaseSelVal"
                placeholder="请选择"
                @change="handChangeDataBase"
                clearable
              >
                <el-option
                  v-for="item in databases"
                  :key="item.dataBase"
                  :label="item.dataBase"
                  :value="item.dataBase"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数据表" prop="tableName">
              <el-select
                v-model="codeDbForm.tableName"
                placeholder="请选择"
                @change="handChangeTable"
                clearable
              >
                <el-option
                  v-for="item in tables"
                  :key="item.tableName"
                  :label="item.tableName"
                  :value="item.tableName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实体名" prop="className">
              <el-input v-model="codeDbForm.className"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="表结构">
          <el-table
            ref="fieldsTable"
            :data="fields"
            tooltip-effect="dark"
            style="width: 100%"
            height="400px"
            v-loading="fieldTableLoading"
            border
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="fieldName" label="数据库字段名">
            </el-table-column>
            <el-table-column label="实体属性名">
              <template slot-scope="scope">
                <el-input v-model="scope.row.fieldModelName"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="fieldDbType" label="数据库字段类型">
            </el-table-column>
            <el-table-column label="实体属性类型">
              <template slot-scope="scope">
                <el-input v-model="scope.row.fieldModelType"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="字段长度">
              <template slot-scope="scope">
                <el-input v-model="scope.row.fieldLength"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="是否为空">
              <template slot-scope="scope">
                <el-select v-model="scope.row.isNotNull">
                  <el-option label="YES" value="YES"></el-option>
                  <el-option label="NO" value="NO"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="isIncrement" label="自增"> </el-table-column>
            <el-table-column prop="isPrimaryKey" label="主键">
            </el-table-column>
            <el-table-column label="描述">
              <template slot-scope="scope">
                <el-input v-model="scope.row.fieldDes"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="默认值">
              <template slot-scope="scope">
                <el-input v-model="scope.row.defaultValue"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="模板方案" prop="codeSchemeId">
          <el-select
            v-model="codeDbForm.codeSchemeId"
            placeholder="请选择"
            @change="handChangeScheme"
            clearable
          >
            <el-option
              v-for="item in codeSchemes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板明细">
          <el-table
            ref="tempTable"
            :data="temps"
            tooltip-effect="dark"
            style="width: 100%"
            height="400px"
            v-loading="tempTableLoading"
            border
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="codeTempName" label="模板名称">
            </el-table-column>
            <el-table-column label="文件名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.fileName"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item class="form-last-item">
          <el-button :loading="genLoading" type="warning" @click="handClickGen"
            >生成</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import * as dbApi from '@/api/code_db'
import * as codeApi from '@/api/code'
import * as schemeApi from '@/api/code_gen_scheme'
import * as tempApi from '@/api/code_temp'
export default {
  name: 'code',
  data() {
    return {
      fieldTableLoading: false,
      tempTableLoading: false,
      codeDbForm: {
        codeSchemeId: '',
        databaseSelVal: '',
        tableName: '',
        className: '',
        dbFieldInfos: [],
        temps: []
      },
      rules: {
        databaseSelVal: [{ required: true, message: '不能为空', trigger: 'blur' }],
        tableName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        className: [{ required: true, message: '不能为空', trigger: 'blur' }],
        codeSchemeId: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      dataSource: [],
      dataSourceSelVal: '',
      databases: [],
      tables: [],
      fields: [],
      codeSchemes: [],
      temps: [],
      genLoading: false,
      connectLoading: false
    }
  },
  mounted() {
    this.getDb()
    this.getSchemes()

  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getDb() {
      dbApi.list(this.$store.getters.userId).then(res => {
        if (res.code === 1) {
          this.dataSource = res.data
        }
      })
    },
    getSchemes() {
      schemeApi.list(this.$store.getters.userId).then(res => {
        if (res.code === 1) {
          this.codeSchemes = res.data
        }
      })
    },
    handClickConnect() {
      if (this.dataSourceSelVal == '') {
        this.$message.warning('请先选择数据源')
        return
      }
      this.reSetData()
      this.reSetCodeScheme()
      let db = this.dataSource.filter(x => x.id == this.dataSourceSelVal)[0];
      let dbParam = { dbType: '', connectString: '' }
      dbParam.dbType = db.type
      dbParam.connectString = db.conStr
      this.connectLoading = true
      codeApi.setDb(dbParam).then(res => {
        if (res.code === 1) {
          codeApi.getDataBases().then(res => {
            if (res.code === 1) {
              this.databases = res.data
              this.$message.info('连接成功')
            }
            this.connectLoading = false
          }).catch(err => {
            this.connectLoading = false
          })
        }
      }).catch(err => {
        this.connectLoading = false
      })
    },
    handChangeDataBase() {
      if (this.codeDbForm.databaseSelVal == '') {
        this.$message.warning('请先选择数据库')
        return
      }
      let param = { dbName: this.codeDbForm.databaseSelVal }
      codeApi.getTableNames(param).then(res => {
        if (res.code === 1) {
          this.tables = res.data
        }
      })
    },
    handChangeTable() {
      if (this.codeDbForm.databaseSelVal == '') {
        this.$message.warning('请先选择数据库')
        return
      }
      if (this.codeDbForm.tableName == '') {
        this.$message.warning('请先选择数据表')
        return
      }
      this.reSetCodeScheme()
      let param = { dbName: this.codeDbForm.databaseSelVal, tableName: this.codeDbForm.tableName }
      this.fieldTableLoading = true;
      codeApi.getDbFields(param).then(res => {
        if (res.code === 1) {
          this.fields = res.data.dbFields
          this.codeDbForm.className = res.data.className
          this.$refs.fieldsTable.toggleAllSelection();
        }
        this.fieldTableLoading = false;
      }).catch(err => {
        this.fieldTableLoading = false;
      })
    },
    handChangeScheme() {
      let { codeSchemeId, className ,  tableName} = this.codeDbForm
      if (className == '') {
        this.$message.warning('请填写实体名称')
        return
      }
      this.tempTableLoading = true;
      codeApi.getSchemeDetials(codeSchemeId, className ,tableName).then(res => {
        if (res.code === 1) {
          this.temps = res.data
          this.$refs.tempTable.toggleAllSelection()
        }
        this.tempTableLoading = false;
      }).catch(err => {
        this.tempTableLoading = false;
      })
    },
    handClickGen() {
      this.$refs.codeGenForm.validate(valid => {
        if (valid) {
          this.codeDbForm.dbFieldInfos = this.$refs.fieldsTable.selection
          this.codeDbForm.temps = this.$refs.tempTable.selection
          if (this.codeDbForm.dbFieldInfos.length == 0) {
            this.$message.warning('请选择字段')
            return
          }
          if (this.codeDbForm.temps.length == 0) {
            this.$message.warning('请选择模板')
            return
          }
          this.genLoading = true
          codeApi.codeGenerator(this.codeDbForm).then(res => {
            if (res.code === 1) {
              if (res.data == '') {
                this.$message.error('生成失败')
                return
              }
              codeApi.downloadCode(res.data).then(res1 => {
                this.download(res1, res.data)
              })
            }
            this.genLoading = false
          })
            .catch(e => {
              this.genLoading = false
            })
        }
      })
    },
    download(data, filename) {
      if (!data || data.data) {
        this.$message.error("生成失败")
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', filename)

      document.body.appendChild(link)
      link.click()
    },
    reSetData(){
      this.codeDbForm.databaseSelVal = ''
      this.codeDbForm.tableName = ''
      this.codeDbForm.className = ''
      this.codeDbForm.dbFieldInfos = []
      this.codeDbForm.temps = []
      this.fields = []
      this.tables = []
    },
    reSetCodeScheme(){
      this.codeDbForm.codeSchemeId = ''
      this.temps = []
    }
  }
}
</script>

