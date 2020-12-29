<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/next">Next</router-link>
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
