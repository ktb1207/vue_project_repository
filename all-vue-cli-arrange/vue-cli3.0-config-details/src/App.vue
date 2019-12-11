<template>
  <div class="container">
    <div id="nav">
      <router-link :to="{name:'routerName',params:{projectId:7089565333249897745}}">Home</router-link> |
      <router-link :to="{name:'about',params:{projectId:7089565333249897745}}">About</router-link>
    </div>
    <div class="router-wrap">
      <router-view/>
    </div>
    
  </div>
</template>

<style lang="less">
  .container{
    position: relative;
    height:100%;
    width:100%;
    min-width: 1200px;
    #nav{
      height:48px;
      line-height: 48px;
      text-align: center;
      background-color:aqua;
    }
    .router-wrap{
      position:absolute;
      top:48px;
      left:0;
      right:0;
      bottom:0;
      overflow: auto;
    }
  }
</style>
