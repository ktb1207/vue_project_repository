<template>
  <div id="app">
    <div class="aside-header">
      <div class="header-tittle float-left">
        
      </div>
      <div class="header-select float-left">
        
      </div>
      <div class="header-user float-right">
        
      </div>
    </div>
    <div class="aside-left">
      <ul class="aside-ul">
        <router-link to="/itemSummary" tag="li">
          <span class="aside-sec-meu">导航1</span>
        </router-link>
        <router-link to="/itemDetails" tag="li">
          <span class="aside-sec-meu">导航2</span>
        </router-link>
        <router-link to="/activeCost" tag="li">
          <span class="aside-sec-meu">导航3</span>
        </router-link>
        <router-link to="/costVerify" tag="li">
          <span class="aside-sec-meu">导航4</span>
        </router-link>
        <router-link to="/monthPlan" tag="li">
          <span class="aside-sec-meu">导航5</span>
        </router-link>
      </ul>
    </div>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
  
export default {
  name: 'App',
  data(){
    return {
      
    }
  },
  computed:{

  },
  watch:{
    "$route":"getParam"
  },
  methods:{
    getParam(){
      //根据路由切换导航菜单栏图标
      let activeUrl = this.$route.name;
    }
  },
  mounted(){
    
  }
}
</script>

<style>

</style>
