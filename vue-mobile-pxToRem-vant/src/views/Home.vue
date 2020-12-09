<template>
  <div class="home">
    <header></header>
    <div>
      <van-button type="primary" size="large" @click="openPopopModel">打开popop弹框</van-button>
    </div>
    <div>
      <van-button type="info" @click="openDateModel">打开日历</van-button>
      <van-button type="info" @click="openContentModel">指定元素位置挂载</van-button>
    </div>
    <div class="content-pop-wrp">
      <div class="pop-relative" id="content-demo"></div>
    </div>
    <div>
      <van-button type="primary" size="large" @click="openLoadingModel">打开loading</van-button>
    </div>
    <div>
      <van-button type="primary" size="large" @click="openMessage">打开message</van-button>
    </div>
    <!-- loading -->
    <popop :visible.sync="loadingModel" popop-class="custom-class-name">
      <van-button type="primary" size="small" @click.stop="openTwoModel">打开第二个</van-button>
    </popop>
    <!-- loading 第二层 -->
    <popop :visible.sync="popModel">
      <van-button type="primary" size="large">我是第二层</van-button>
    </popop>
    <!-- 日历 -->
    <popop :visible.sync="dateModel">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        title="选择年月"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
      />
    </popop>
    <popop :visible.sync="contentModel" appent-to="#content-demo"></popop>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Home',
  components: {},
  data(){
    return {
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      loadingModel: false,
      popModel: false,
      dateModel: false,
      contentModel: false,
    };
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    
  },
  beforeDestroy () {},
  methods: {
    openPopopModel () {
      this.loadingModel = true;
    },
    openDateModel() {
      this.dateModel = true;
    },
    openTwoModel () {
      this.popModel = true;
    },
    openContentModel () {
      this.contentModel = true;
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      }
      return val;
    },
    // loading
    openLoadingModel () {
      this.$Loading({
        showPop: true,
        delay:5000,
        beforeClose: this.waitingClose
      });
    },
    waitingClose () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // resolve(true);
          reject(false);
        },3000);
      });
    },
    // message
    openMessage () {
      this.$message.success('打开的信息按钮');
    }
  },
};
</script>

<style lang="less">
  .home{
    header{
      width:375px;
      height:80px;
      background-color: aqua;
    }
    .content-pop-wrp{
      width:100%;
      height:320px;
      background-color: bisque;
      padding:32px;
      .pop-relative{
        width:100%;
        height:100%;
        background-color: #fff;
        position: relative;
      }
    }
  }
</style>
