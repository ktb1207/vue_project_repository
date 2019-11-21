<style lang="less">
  .back-home{

  }
</style>
<template>
  <div class="back-home">
    <el-button type="danger" round @click="hrefHome">返回首页</el-button>
  </div>
</template>
<script>
export default {
  name: 'backHome',
  props: {},
  data() {
    return {
    };
  },
  computed: {},
  components: {},
  watch: {},
  methods: {
    hrefHome() {
      this.$router.push({
        name: 'home'
      });
    }
  },
  created() {},
  mounted() {},
  updated() {},
  beforeDestroy() {}
};
</script>
