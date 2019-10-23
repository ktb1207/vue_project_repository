<template>
  <div id="app">
    <div class="view-wrp">
      <router-view/>
      <div v-show="isShowLoading" class="loading-wrp"></div>
    </div>
    <div class="bottom-btn">
      <bottom-router :btn-list="btnList" :active-index="btnActive" @btnClick="refeshPage"></bottom-router>
    </div>
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import homeNormal from "@/assets/home.png";
import homeActive from "@/assets/home_active.png";
import findNormal from "@/assets/find.png";
import findActive from "@/assets/find_active.png";
import saveNormal from "@/assets/save.png";
import saveActive from "@/assets/save_active.png";
import myNormal from "@/assets/my.png";
import myActive from "@/assets/my_active.png";
import BottomRouter from "@/components/BottomRouter.vue";
export default {
  name: "App",
  data() {
    return {
      btnList: [
        {
          name: "首页",
          normalImg: homeNormal,
          activeImg: homeActive,
          path: "home"
        },
        {
          name: "发现",
          normalImg: findNormal,
          activeImg: findActive,
          path: "find"
        },
        {
          name: "收藏",
          normalImg: saveNormal,
          activeImg: saveActive,
          path: "save"
        },
        {
          name: "我的",
          normalImg: myNormal,
          activeImg: myActive,
          path: "my"
        }
      ],
      btnActive: 0
    };
  },
  computed: {
    isShowLoading() {
      return this.$store.state.showLoading;
    }
  },
  components: {
    BottomRouter
  },
  watch: {
    $route: "changeRouter"
  },
  methods: {
    //页面切换
    refeshPage(obj) {
      this.$router.push(obj.path);
    },
    //监听路由变化
    changeRouter(to, from) {}
  },
  created() {},
  mounted() {},
  updated() {
    //页面刷新修改激活导航按钮索引
    this.btnActive = this.$router.history.current.meta.index;
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
