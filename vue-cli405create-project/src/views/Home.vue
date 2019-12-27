<style lang="less">
  .home-page{
    height:auto;
    padding:4px 14px;
    .explan{
      color:red;
    }
    .menus-button-wrp{
      height:auto;
    }
  }
</style>
<template>
  <div class="home-page">
    <h2 class="explan">
      此示例工程用于VUE的学习和知识梳理总结
    </h2>
    <div class="menus-button-wrp">
      <el-button type="primary" @click="hrefParams">路由params传参</el-button>
      <el-button type="primary" @click="hrefQuery">路由query传参</el-button>
      <el-button type="primary" @click="routerParams">路由中定义参数</el-button>
      <el-button type="primary" @click="hrefComemonPage('swiperPage')">swiperDemo</el-button>
      <el-button type="primary" @click="hrefComemonPage('boxShadow')">css 边框阴影</el-button>
      <el-button type="primary" @click="hrefComemonPage('transformTwo')">transform 2D</el-button>
      <el-button type="primary" @click="hrefComemonPage('string')">String</el-button>
      <el-button type="primary" @click="hrefComemonPage('array')">Array</el-button>
      <el-button type="primary" @click="hrefComemonPage('number')">Number</el-button>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
export default {
  name: 'home',
  props: {},
  data() {
    return {};
  },
  computed: {},
  components: {},
  watch: {},
  methods: {
    // params传参
    hrefParams() {
      // this.$router.push({
      //   path: '/paramsPage',
      //   params: {
      //     name: 'java'
      //   }
      // });
      this.$router.push({
        name: 'paramsPage',
        params: {
          value: '我是页面params传参的参数值，刷新页面将看不到我呦，不信你试试？'
        }
      });
      /**
       * 用法：
       * params传参要用路由name引入，不能用path引入，否则this.$route.params拿到的则是空对象
       * 显示：
       * params则类似于post，不会在浏览器地址栏显示参数
       * 刷新：
       * 通过路由params传值，刷新页面数据会消失
       * */
    },
    // query传参
    hrefQuery() {
      this.$router.push({
        // name: 'queryPage',
        path: '/queryPage',
        query: {
          value: '我是页面query传参的参数值，刷新页面我还在不信你试试？'
        }
      });
      /**
       * 用法：query传参可以用name或者path引入
       * 显示：
       * query更加类似于我们ajax中get传参，会在浏览器地址栏显示
       * 刷新：
       * 通过路由query传值，刷新页面数据还在，因为浏览器地址栏参数不变
       * */
    },
    // 参数命名路由
    routerParams() {
      this.$router.push({
        name: 'nameRouterPage',
        params: {
          projectId: 10002228
        }
      });
      // this.$router.push({
      //   path: '/1000022555/nameRouterPage'
      // });
      /**
       *
       * 用法：
       * 以上两种方式name和path都可以使用，使用name路由，参数通过params传递，使用path路由，参数在path里面传递
       * 显示：
       * 会在浏览器地址栏显示
       * 刷新：
       * 页面刷新参数还在地址栏存在
       * */
    },
    hrefComemonPage(routerName) {
      this.$router.push({
        name: routerName
      });
    }
  },
  created() {},
  mounted() {},
  updated() {},
  beforeDestroy() {}
};
</script>
