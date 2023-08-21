<template>
  <div class="navbar">
    <top-nav />
    <div class="right-menu">
      <search id="header-search" class="right-menu-item" />
      <RefreshBtn id="RefreshBtn" class="right-menu-item hover-effect" />
      <screenfull id="screenfull" class="right-menu-item hover-effect" />

      <el-dropdown v-if="islogin()" class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatarUrl" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              <i class="iconfont icon-home" /> 后台
            </el-dropdown-item>
          </router-link>
          <router-link to="/user/info">
            <el-dropdown-item>
              <i class="iconfont icon-user" /> 个人中心
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="handlerLogout">
            <span
              style="display: block"
            ><i class="iconfont icon-logout" /> 溜了</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div v-else class="right-menu-item">
        <router-link to="/login?redirect=front">请登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'
import { logout, getInfo } from '@/api/user'
import RefreshBtn from '@/components/RefreshBtn'
import TopNav from '@/layout/FrontLayout/components/TopNav'
export default {
  components: {
    Screenfull,
    Search,
    RefreshBtn,
    TopNav
  },
  data() {
    return {
      avatar: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    avatarUrl() {
      return this.avatar
    }
  },
  mounted() {
    const id = this.$store.getters.userId
    getInfo(id).then(res => {
      if (res.code === 1) {
        this.avatar = process.env.VUE_APP_BASE_API + res.data.avatar
      }
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handlerLogout() {
      logout().then(() => {
        this.$store.dispatch('user/logout')
        this.$router.replace('/login')
      }).catch(() => {
        this.$store.dispatch('user/logout')
        this.$router.replace('/login')
      })
    },
    islogin() {
      return this.$store.state.user.token
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  margin-bottom: 10px;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
