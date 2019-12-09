<style lang="less">
  .swiper-study{
    height:auto;
    padding:12px 24px;
    .flex-wrp{
      width:600px;
      height:600px;
      display: flex;
      flex-direction: column;
      border:1px solid #555555;
      .flex-header{
        flex: 0 0 80px;
        background-color: aqua;
      }
      .flex-content{
        flex: 1 1 auto;
        .swiper-container{
          .swiper-wrapper{
            .swiper-slide{
              &:nth-child(2n){
                background-color: red;
              }
              &:nth-child(2n+1){
                background-color: gold;
              }
            }
          }
        }
      }
    }
  }
</style>
<template>
  <div class="swiper-study">
    <back-home></back-home>
    <div class="flex-wrp">
      <div class="flex-header"></div>
      <div class="flex-content">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide>I'm Slide 1</swiper-slide>
          <swiper-slide>I'm Slide 2</swiper-slide>
          <swiper-slide>I'm Slide 3</swiper-slide>
          <swiper-slide>I'm Slide 4</swiper-slide>
          <div class="swiper-pagination"  slot="pagination"></div>
        </swiper>
      </div>
    </div>
  </div>
</template>
<script>
import BackHome from '../components/BackHome';
export default {
  name: 'swiperStudy',
  props: {},
  data() {
    return {
      swiperOption: {
        autoplay: true, // 可选选项，自动滑动
        direction: 'vertical',
        loop: true,
        slidesPerView: 1,
        autoHeight: true, // 高度随内容变化
        pagination: {
          el: '.swiper-pagination',
          type: 'progressbar',
          progressbarOpposite: true
        }
      }
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
    this.$nextTick(() => {
      console.log(this.$refs.mySwiper);
    });
  },
  updated() {},
  beforeDestroy() {}
};
</script>
