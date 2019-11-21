<style lang="less">
  .params-page{
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
  <div class="params-page">
    <back-home></back-home>
    <h2 class="explan">关于params方式传参总结</h2>
    <h3 class="value">{{paramsValue}}</h3>
    <ol>
      <li>显示：params则类似于post，不会在浏览器地址栏显示参数，不作为路由的一部分</li>
      <li>刷新：通过路由params传值，刷新页面数据会消失</li>
    </ol>
  </div>
</template>
<script>
import BackHome from '../components/BackHome';
export default {
  name: 'paramsPage',
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
    console.log(this.$route.params.value);
    this.paramsValue = this.$route.params.value;
  },
  updated() {},
  beforeDestroy() {}
};
</script>
