<template>
  <div class="app-container c-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="个人信息" name="info">
        <el-form ref="userForm" label-width="100px">
          <el-form-item label="用户名">
            <el-input :value="userInfo.userName"></el-input>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-input :value="userInfo.registerTime"></el-input>
          </el-form-item>
          <el-form-item label="上次登录时间">
            <el-input :value="userInfo.loginTime"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="密码修改" name="password">
        <el-form
          :model="userPwd"
          ref="pwdForm"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input v-model="userPwd.oldPwd" :type="oldPwdType" class="small-input">
               <svg-icon slot="suffix" :icon-class="oldPwdType === 'password' ? 'eye' : 'eye-open'"  @click="showPwd(1)"/>
            </el-input>
           
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd" >
            <el-input v-model="userPwd.newPwd" :type="passwordType"  class="small-input">
              <svg-icon slot="suffix" :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"  @click="showPwd(2)"/>
            </el-input>
            
        </span>
          </el-form-item>
          <el-form-item label="重复密码" prop="reNewPwd">
            <el-input v-model="userPwd.reNewPwd" :type="repasswordType"  class="small-input">
              <svg-icon slot="suffix" :icon-class="repasswordType === 'password' ? 'eye' : 'eye-open'"  @click="showPwd(3)"/>
            </el-input>
            
        </span>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="handSubmitClick">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
</template>

<script>
import * as userApi from '@/api/user'
export default {
  name:'user_info',
  mounted() {
    this.userInfo.id = this.$store.getters.userId
    this.getUserInfo(this.userInfo.id)
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value.length > 18) {
        callback(new Error('密码长度必须在[6,18]之间'))
      } else {
        callback()
      }
    }
    const validateRePassword = (rule, value, callback) => {
      if (value !== this.userPwd.newPwd) {
        callback(new Error('两次输入密码不一致'))
      }
      else {
        callback()
      }
    }
    return {
      activeName: 'info',
      userInfo: {

      },
      userPwd: {
        userId: '',
        oldPwd: '',
        newPwd: '',
        reNewPwd: ''
      },
      rules: {
        oldPwd: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPwd: [{ required: true, trigger: 'blur', validator: validatePassword }],
        reNewPwd: [{ required: true, trigger: 'blur', validator: validateRePassword }]
      },
      oldPwdType:'password',
      passwordType: 'password',
      repasswordType: 'password',

    }
  },
  methods: {
    getUserInfo(userId) {
      userApi.getInfo(userId).then(res => {
        this.userInfo = res.data
      })
    },
    handSubmitClick() {
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          this.userPwd.userId = this.userInfo.id
          userApi.editPwd(this.userPwd).then(res => {
            if (res.code === 1) {
              this.$confirm('密码修改成功, 请重新登录?', '提示', {
                type: 'info'
              }).then(() => {
                this.$store.dispatch('user/logout');
                this.$router.push(`/login`);
              })
            }
          })
        }
      })
    },
    showPwd(type) {
      if (type === 1) {
        if (this.oldPwdType === 'password') {
          this.oldPwdType = ''
        } else {
          this.oldPwdType = 'password'
        }
      } else if (type === 2) {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      } else{
        if (this.repasswordType === 'password') {
          this.repasswordType = ''
        } else {
          this.repasswordType = 'password'
        }
      }
    },
  }
}
</script>

<style>

</style>