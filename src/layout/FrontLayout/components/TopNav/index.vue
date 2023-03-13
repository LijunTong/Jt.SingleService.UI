<template>
  <div class="nav-con">
    <div
      class="nav-item"
      v-for="(item, key) in getFrontNavs"
      :key="key"
      :class="getActive(item.url) ? 'item-active' : ''"
    >
      <router-link :to="item.url">
        {{ item.title }}
      </router-link>
    </div>
  </div>
</template>

<script>
import frontNavs from "@/router/front_nav"
export default {
  name: 'TopNav',
  computed: {
    getFrontNavs() {
      return frontNavs
    }
  },
  methods: {
    getActive(url) {
      return this.$route.path === url
    }
  }

}
</script>

<style>
.nav-con {
  display: inline-block;
  height: 100%;
  margin: 0 !important;
}
.nav-item {
  height: 100%;
  float: left;
  width: 50px;
  line-height: 50px;
  text-align: center;
}
.item-active {
  background-color: blueviolet;
  color: aliceblue;
}
</style>