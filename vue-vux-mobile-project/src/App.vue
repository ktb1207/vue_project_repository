<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue';
import { LoadingPlugin, ToastPlugin } from 'vux';
import { mapState, mapActions } from 'vuex';
Vue.use(LoadingPlugin);
Vue.use(ToastPlugin);
export default {
  name: 'App',
  computed: {
    ...mapState(['loadingStatus', 'errorText'])
  },
  watch: {
    loadingStatus(newVal) {
      if (newVal) {
        this.$vux.loading.show({ text: '' });
      } else {
        this.$vux.loading.hide();
      }
    },
    errorText(newVal) {
      console.log(newVal);
      if (newVal) {
        this.$vux.toast.show({
          text: newVal,
          type: 'warn'
        });
      }
    }
  },
  methods: {
    ...mapActions(['showLoading', 'hideLoading', 'showError'])
  },
  created() {},
  mounted() {}
};
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/close.less';
@import './styles/main.less';
#app {
  height: 100%;
  overflow: hidden;
}
</style>
