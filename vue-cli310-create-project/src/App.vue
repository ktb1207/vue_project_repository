<template>
  <div id="app">
    <model-title title-name="项目标题要修改">
      <div
        slot="right"
        class="title-right-wrp"
      >top right</div>
    </model-title>
    <div class="page-router">
      <router-view />
    </div>
    <!-- 全局loading -->
    <loading v-if="showLoading"></loading>
  </div>
</template>

<script>
import ModelTitle from './components/ModuleTitle.vue';
import Loading from './components/Loading.vue';
import { setTimeout } from 'timers';
export default {
  name: 'app',
  data () {
    return {
      model1: ''
    };
  },
  computed: {
    showLoading () {
      return this.$store.state.showLoading;
    }
  },
  components: {
    ModelTitle,
    Loading
  },
  methods: {},
  created () {
    this.$store.dispatch('saveProjectId', this.$route.params.projectId);
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$store.dispatch('saveLoading', false);
      }, 1000);
    });
  }
};
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  position: relative;
  min-width: 1200px;
  overflow-x: auto;
  .title-right-wrp {
    text-align: right;
  }
  .page-router {
    height: calc(100% - 35px);
  }
}
</style>
