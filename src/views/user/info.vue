<template>
  <div class="app-container c-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="个人信息" name="info">
        <el-descriptions class="margin-top" :column="1" border>
          <el-descriptions-item label="头像">
            <el-upload
              class="avatar-uploader"
              :action="uploadAction"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
            >
              <!-- :http-request="onUpload" -->
              <img v-if="userInfo.avatar" :src="avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-descriptions-item>
          <el-descriptions-item label="用户名">{{
            userInfo.userName
          }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{
            userInfo.registerTime
          }}</el-descriptions-item>
          <el-descriptions-item label="上次登录时间">{{
            userInfo.loginTime
          }}</el-descriptions-item>
          <el-descriptions-item
            v-for="(userRole, index) in userInfo.userRoles"
            :key="index"
            label="角色"
          >
            <el-tag>{{ userRole.role.name }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="粉丝数">{{
            userInfo.followCount
          }}</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="密码修改" name="password">
        <el-form
          ref="pwdForm"
          :model="userPwd"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item label="旧密码" prop="oldPwd">
            <el-input
              v-model="userPwd.oldPwd"
              :type="oldPwdType"
              class="small-input"
            >
              <svg-icon
                slot="suffix"
                :icon-class="oldPwdType === 'password' ? 'eye' : 'eye-open'"
                @click="showPwd(1)"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input
              v-model="userPwd.newPwd"
              :type="passwordType"
              class="small-input"
            >
              <svg-icon
                slot="suffix"
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                @click="showPwd(2)"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="重复密码" prop="reNewPwd">
            <el-input
              v-model="userPwd.reNewPwd"
              :type="repasswordType"
              class="small-input"
            >
              <svg-icon
                slot="suffix"
                :icon-class="repasswordType === 'password' ? 'eye' : 'eye-open'"
                @click="showPwd(3)"
              />
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="handSubmitClick">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as userApi from '@/api/user'
export default {
  name: 'UserInfo',
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
      } else {
        callback()
      }
    }
    return {
      activeName: 'info',
      userInfo: {},
      userPwd: {
        userId: '',
        oldPwd: '',
        newPwd: '',
        reNewPwd: ''
      },
      rules: {
        oldPwd: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        newPwd: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        reNewPwd: [
          { required: true, trigger: 'blur', validator: validateRePassword }
        ]
      },
      oldPwdType: 'password',
      passwordType: 'password',
      repasswordType: 'password',
      avatarAction: ''
    }
  },
  computed: {
    // 计算属性的 getter
    avatar: function() {
      // `this` 指向 vm 实例
      return process.env.VUE_APP_BASE_API + this.userInfo.avatar
    },
    uploadAction: function() {
      // `this` 指向 vm 实例
      return process.env.VUE_APP_BASE_API + 'File/UploadAvatar'
    }
  },
  mounted() {
    this.userInfo.id = this.$store.getters.userId
    this.getUserInfo(this.userInfo.id)
  },
  methods: {
    getUserInfo(userId) {
      userApi.get(userId).then((res) => {
        this.userInfo = res.data
      })
    },
    handSubmitClick() {
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          this.userPwd.userId = this.userInfo.id
          userApi.editPwd(this.userPwd).then((res) => {
            if (res.code === 1) {
              this.$confirm('密码修改成功, 请重新登录?', '提示', {
                type: 'info'
              }).then(() => {
                this.$store.dispatch('user/logout')
                this.$router.push(`/login`)
              })
            }
          })
        }
      })
    },
    handUserSubmitClick() {
      if (!this.userInfo.avatar) {
        this.$message.warning('请先选择头像')
        return
      }
      userApi.updateAvatar(this.userInfo).then((res) => {
        if (res.code === 1) {
          this.$message.info('提交成功')
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
      } else {
        if (this.repasswordType === 'password') {
          this.repasswordType = ''
        } else {
          this.repasswordType = 'password'
        }
      }
    },

    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    onUpload(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      userApi.UploadAvatar(formData).then((res) => {
        if (res.code === 1) {
          this.$message.success('上传成功')
        }
      })
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 1) {
        this.userInfo.avatar = res.data
        this.$message.success('上传成功')
        this.handUserSubmitClick()
      }
      // this.userInfo.avatar = URL.createObjectURL(file.raw);
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  color: #8c939d;
  width: 10em;
  height: 10em;
  line-height: 10em;
  text-align: center;
}
.avatar {
  width: 10em;
  height: 10em;
  display: block;
}
</style>
