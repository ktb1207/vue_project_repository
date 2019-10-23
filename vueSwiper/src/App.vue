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
        <router-link to="/pageOne" tag="li">
          <span class="aside-sec-meu">swiperDemo</span>
        </router-link>
        <router-link to="/pageTwo" tag="li">
          <span class="aside-sec-meu">swiperGroup</span>
        </router-link>
        <router-link to="/pageThree" tag="li">
          <span class="aside-sec-meu">drag</span>
        </router-link>
        <router-link to="/pageFour" tag="li">
          <span class="aside-sec-meu">animate</span>
        </router-link>
        <router-link to="/pageFive" tag="li">
          <span class="aside-sec-meu">echarts</span>
        </router-link>
        <router-link to="/pageSix" tag="li">
          <span class="aside-sec-meu">treeTable</span>
        </router-link>
        <router-link to="/pageSeven" tag="li">
          <span class="aside-sec-meu">vueLoading</span>
        </router-link>
        <router-link to="/pageEight" tag="li">
          <span class="aside-sec-meu">ElementTable</span>
        </router-link>
        <router-link to="/pageNine" tag="li">
          <span class="aside-sec-meu">wangEditor</span>
        </router-link>
      </ul>
    </div>
    <div class="container">
      <!-- <transition :name="transitionRouter">
        
      </transition> -->
      <router-view/>
    </div>
  </div>
</template>

<script>
  
export default {
  name: 'App',
  data(){
    return {
      transitionRouter:'slide-come',
    }
  },
  computed:{

  },
  watch:{
    "$route":"getParam"
  },
  methods:{
    getParam(to,from){
      //根据路由切换导航菜单栏图标
      let activeUrl = this.$route.name;
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if(to.meta.index > from.meta.index){
        //设置动画名称
        this.transitionRouter = 'slide-come';
      }else{
        this.transitionRouter = 'slide-go';
      }
    }
  },
  mounted(){
    
  }
}
</script>

<style>
  .slide-go-enter-active,
  .slide-go-leave-active,
  .slide-come-enter-active,
  .slide-come-leave-active {
    will-change: transform;
    transition: all 500ms;
    position: absolute;
  }
  .slide-go-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .slide-go-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-come-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-come-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
</style>
