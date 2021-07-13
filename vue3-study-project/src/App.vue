<template>
  <div id="nav">
    <router-link to="/">Home</router-link> | <router-link to="/setup">setup</router-link> |
    <router-link to="/reactive">reactive</router-link> | <router-link to="/ref">ref</router-link> |
    <router-link to="/isReactiveAndRef">isRef和isReactive</router-link> | <router-link to="/notRecursion">非递归监听</router-link> |
    <router-link to="/toRef">toRef</router-link> | <router-link to="/readonly">readonly</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view />
</template>

<style lang="scss">
#app {
  #nav {
    padding: 14px;
    color: #2c3e50;
    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
}
</style>
