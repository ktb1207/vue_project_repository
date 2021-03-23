<template>
  <div id="nav">
    <router-link to="/">Home</router-link> | <router-link to="/happyYear">Happy Year</router-link> |
    <router-link to="/coordinate">坐标相关</router-link> | <router-link to="/kTable">固定表格表头</router-link> |
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
