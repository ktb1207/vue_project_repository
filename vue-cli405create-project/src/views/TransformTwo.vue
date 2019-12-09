<style lang="less">
  .transform-two{
    height:auto;
    .demo-wrp{
      width:100%;
      padding:24px;
      position:relative;
      clear:both;
      .float-item{
        float:left;
        width:100px;
        height:100px;
        background-color: aqua;
        overflow: hidden;
        & + .float-item{
          margin-left:24px;
        }
      }
      .transfer-demo-one{
        transform: scale(0.5,0.5);
        .position-demo{
          position:absolute;
          bottom:0;
          right:0;
        }
      }
      .transition-one{
        transition: width 1s ease-in-out;
      }
      .transition-width{
        width:0px;
      }
      .transition-two{
        transition:transform 1s ease-in;
      }
      .transition-transform{
        transform: scaleX(0);
        transform-Origin:left center;
      }
    }
  }
</style>
<template>
  <div class="transform-two">
    <back-home></back-home>
    <div class="demo-wrp">
      <div class="float-item">1</div>
      <div class="float-item transfer-demo-one">
        <span class="position-demo">2</span>
      </div>
      <div class="float-item">3</div>
      <div class="float-item">4</div>
      <div class="float-item">5</div>
    </div>
    <div class="demo-wrp">
      <h2>关于css3中transform的使用注意事项：</h2>
      <ol>
        <li>transform不会影响响铃元素</li>
        <li>transform的使用会在自身隐藏添加position:relative相对定位</li>
      </ol>
    </div>
    <div class="demo-wrp">
      <div class="float-item">1</div>
      <div class="float-item">2</div>
      <div class="float-item transition-one" :class="{'transition-width':transitionOne}">我会变化</div>
      <div class="float-item transition-two" :class="{'transition-transform':transitionTwo}">4</div>
      <div class="float-item">5</div>
      <el-button type="primary" @click="transitionOne = !transitionOne">触发过渡{{transitionOne}}</el-button>
      <el-button type="primary" @click="transitionTwo = !transitionTwo">触发过渡{{transitionTwo}}</el-button>
    </div>
  </div>
</template>
<script>
import BackHome from '../components/BackHome';
export default {
  name: 'transformTwo',
  props: {},
  data() {
    return {
      transitionOne: false,
      transitionTwo: false
    };
  },
  computed: {},
  components: {
    BackHome
  },
  watch: {},
  methods: {},
  created() {},
  mounted() {},
  updated() {},
  beforeDestroy() {}
};
</script>
