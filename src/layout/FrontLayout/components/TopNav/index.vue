<template>
  <div class="nav-con">
    <div
      
      class="nav-item"
      v-for="(item, key) in column"
      :key="key"
      :ref="item.id"
      :class="getActive(item.url) ? 'item-active' : ''"
    >
      <router-link :to="item.url">
        {{ item.name }}
      </router-link>
    </div>
  </div>
</template>

<script>
import frontNavs from "@/router/front_nav"
import { list } from "@/api/column"
export default {
  name: 'TopNav',
  mounted(){
    this.getColumn();
  },
  computed: {
    getFrontNavs() {
      return frontNavs
    }
  },
  data(){
    return {
      column:[]
    }
  },
  methods: {
    getActive(url) {
      return this.$route.fullPath === url
    },
    getColumn(){
      list().then(res => {
        if (res.code === 1){
          this.column.push({
            'name':'推荐',
            'url':'/front'
          })
          
          if (res.data.length > 0){
            res.data.forEach(element => {
              element.url = `/front?column=${element.id}`
              this.column.push(element)
            });
          }
        }
      })
    },
    colClick(id){
      console.log(id);
      this.$refs[id].className = "item-active"
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