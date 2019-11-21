<style lang="less">
  .namerouter-page{
    height:auto;
    padding:4px 14px;
    .explan{
      color:red;
    }
    .value{
      color:green;
    }
    ul{
      list-style: square outside;
    }
    ol{
      list-style: decimal outside;
    }
  }
</style>
<template>
  <div class="namerouter-page">
    <back-home></back-home>
    <h2 class="explan">关于参数作为路由路径方式传参总结</h2>
    <h3 class="value">我是参数{{paramsValue}}作为路由的一部分，刷新还在，你试试？</h3>
    <ol>
      <li>显示：在路由中定义参数，会在浏览器地址栏显示</li>
      <li>刷新：在路由中定义参数，刷新页面数据还在，因为浏览器地址栏参数不变</li>
    </ol>
  </div>
</template>
<script>
// @ is an alias to /src
import BackHome from '../components/BackHome';
export default {
  name: 'index',
  props: {},
  data() {
    return {
      paramsValue: ''
    };
  },
  computed: {},
  components: {
    BackHome
  },
  watch: {},
  methods: {},
  created() {},
  mounted() {
    this.paramsValue = this.$route.params.projectId;
  },
  updated() {},
  beforeDestroy() {}
};
</script>
