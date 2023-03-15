<template>
  <div class="login-container">
    <vue-particles
      color="#409EFF"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="6"
      linesColor="#409EFF"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ title }}·注册</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd(1)">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-form-item prop="repassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="repasswordType"
          ref="repassword"
          v-model="loginForm.repassword"
          :type="repasswordType"
          placeholder="重复密码"
          name="repassword"
          tabindex="3"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd(2)">
          <svg-icon
            :icon-class="repasswordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-button
            :loading="loading"
            type="primary"
            style="margin-bottom: 30px; width: 100%"
            @click.native.prevent="handlerRegister"
            >注册</el-button
          >
        </el-col>
        <el-col :span="12">
          <el-button
            type="info"
            style="margin-bottom: 30px; width: 100%"
            @click.native.prevent="handlerBack"
            >返回登录</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import * as userApi from "@/api/user";
import getTitle from "@/utils/get-page-title";

var _this;
export default {
  name: "Register",
  mounted() {
    this.title = getTitle();
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 5 || value.length > 12) {
        callback(new Error("用户名长度必须在[5,12]之间"));
      } else {
        userApi.checkUserName(value).then((result) => {
          if (result.code === 1) {
            if (result.data) {
              callback(new Error("用户名已存在"));
            }
          }
          callback();
        });
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value.length > 18) {
        callback(new Error("密码长度必须在[6,18]之间"));
      } else {
        callback();
      }
    };
    const validateRePassword = (rule, value, callback) => {
      if (value !== this.loginForm.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        repassword: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        repassword: [
          { required: true, trigger: "blur", validator: validateRePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      repasswordType: "password",
      redirect: undefined,
      title: "",
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd(type) {
      if (type === 1) {
        if (this.passwordType === "password") {
          this.passwordType = "";
        } else {
          this.passwordType = "password";
        }
      } else {
        if (this.repasswordType === "password") {
          this.repasswordType = "";
        } else {
          this.repasswordType = "password";
        }
      }
    },
    handlerBack() {
      this.$router.push({ path: "/login" });
    },
    handlerRegister() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          var data = {
            username: this.loginForm.username,
            password: this.loginForm.password,
          };
          userApi.register(data).then((res) => {
            if (res.code === 1) {
              this.$message({
                message: "注册成功，即将跳转至登录页",
                type: "success",
                onClose: () => {
                  this.$router.push({ path: "/login" });
                },
              });
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
#particles-js {
  width: 100%;
  height: calc(100% - 100px);
  position: absolute;
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
