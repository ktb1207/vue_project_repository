<style lang="less">
  .query-page{
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
  <div class="query-page">
    <back-home></back-home>
    <h2 class="explan">关于query方式传参总结</h2>
    <h3 class="value">{{queryValue}}</h3>
    <ol>
      <li>显示：query更加类似于我们ajax中get传参，会在浏览器地址栏显示</li>
      <li>刷新：通过路由query传值，刷新页面数据还在，因为浏览器地址栏参数不变</li>
    </ol>
  </div>
</template>
<script>
import BackHome from '../components/BackHome';
export default {
  name: 'queryPage',
  props: {},
  data() {
    return {
      queryValue: ''
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
    console.log(this.$route);
    this.queryValue = this.$route.query.value;
  },
  updated() {},
  beforeDestroy() {}
};
</script>
