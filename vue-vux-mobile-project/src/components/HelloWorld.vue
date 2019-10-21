<template>
  <div>
    <div class="hello">123456</div>
    <x-header></x-header>
  </div>
</template>

<script>
import { XHeader } from 'vux';
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  },
  components: {
    XHeader
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.hello {
  width: 375px;
  height: 66px;
  background-color: aqua;
}
</style>
