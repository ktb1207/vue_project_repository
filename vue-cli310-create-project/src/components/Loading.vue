<style lang="less">
.loading-wrp {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
  .loading-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
<template>
  <div class="loading-wrp">
    <div class="loading-center">
      <vue-loading type="spiningDubbles" color="#3999ff" :size="{ width: '80px', height: '80px' }"></vue-loading>
    </div>
  </div>
</template>
<script>
import { VueLoading } from 'vue-loading-template';
export default {
  name: 'Loading',
  components: {
    VueLoading
  }
};
</script>
