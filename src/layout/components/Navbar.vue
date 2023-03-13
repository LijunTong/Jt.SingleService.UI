<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!-- <search id="header-search" class="right-menu-item" /> -->
      <!-- <RefreshBtn id="RefreshBtn" class="right-menu-item hover-effect" /> -->
      <screenfull id="screenfull" class="right-menu-item hover-effect" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatarUrl" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> <i class="iconfont icon-home"></i> 首页 </el-dropdown-item>
          </router-link>
          <router-link to="/user/info">
            <el-dropdown-item> <i class="iconfont icon-user"></i> 个人中心 </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="handlerLogout">
            <span style="display: block"><i class="iconfont icon-logout"></i> 溜了</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import Search from "@/components/HeaderSearch";
import { logout, getInfo } from '@/api/user';
import RefreshBtn from "@/components/RefreshBtn"

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    Search,
    RefreshBtn
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
    avatarUrl(){
      return require('@/assets/avatar/avatar.jpg')
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    handlerLogout() {
      logout().then(() => {
        this.$store.dispatch('user/logout');
        this.$router.replace('/login')
      }).catch(()=>{
        this.$store.dispatch('user/logout');
        this.$router.replace('/login');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

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
