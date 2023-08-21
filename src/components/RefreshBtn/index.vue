<template>
  <div>
    <i class="iconfont icon-reload" @click="click" />
  </div>
</template>

<script>
import { getMenuTree } from '@/api/menu'
export default {
  name: 'RefreshBtn',
  data() {
    return {
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    click() {
      getMenuTree().then(res => {
        if (res.code === 1) {
          this.$store.dispatch('user/setMenus', res.data)
          this.$router.go(0)
        }
      })
    }
  }
}
</script>
