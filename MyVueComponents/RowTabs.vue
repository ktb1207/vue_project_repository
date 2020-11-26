/**
* tab 组件
* itemArr: ['标题1', '标题2']
* activeIndex: 0,
* @tabClick
*/ 
<template>
  <div class="row-tabs" ref="rowTab">
    <div 
      v-for="(item, index) in itemArr" :key="index + 'cc'" 
      class="tab-item" 
      :class="[selectTabIndex === index ? 'active-tab' : '']"
      @click="tabClick(index)">
      <span>{{item}}</span>
    </div>
    <div class="tab-line" :style="{'width': tabLineWidth + 'px', 'transform': `translateX(${lineOffset}px)`}"></div>
  </div>
</template>

<script>
export default {
  name: 'RowTabs',
  props: {
    itemArr: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  components: {},
  data () {
    return {
      tabLineWidth: 0,
      addLineWidth: 40,
      lineOffset: 0,
      selectTabIndex: this.activeIndex
    };
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.$nextTick(() => {
      this.moveLine();
    });
  },
  updated () {
    this.$nextTick(() => {
      this.moveLine();
    });
  },
  beforeDestory () {},
  methods: {
    // 点击切换
    tabClick (inx) {
      this.selectTabIndex = inx;
      this.$emit('tabClick', inx);
    },
    moveLine () {
      const tabItem = this.$refs.rowTab.children;
      for (let i=0; i<tabItem.length; i++) {
        if (tabItem[i].className.includes('active-tab')) {
          const parentOffsetLeft = tabItem[i].offsetLeft;
          const parentWidth = parseInt(window.getComputedStyle(tabItem[i]).width);
          const activeSpan = tabItem[i].children[0];
          const activeSelfWidth = parseInt(window.getComputedStyle(activeSpan).width) + this.addLineWidth;
          this.tabLineWidth = activeSelfWidth;
          this.lineOffset = parentOffsetLeft + parseInt((parentWidth - activeSelfWidth) / 2);
        }
      }
    }
  }
};
</script>

<style lang='less' scoped>
.row-tabs{
  height:117px;
  line-height: 117px;
  font-size:28px;
  color:#333;
  background-color: #fff;
  box-shadow: 0px 0px 10px 0px rgba(35, 24, 21, 0.18);
  display: flex;
  flex-wrap: nowrap;
  position:relative;
  & > .tab-item{
    flex:1 1 auto;
    text-align: center;
    span{
      display: inline-block;
    }
  }
  & > .active-tab {
    color: #50ABE7;
  }
  & > .tab-line{
    position:absolute;
    left:0;
    bottom:0;
    width:0;
    height:4px;
    background-color: #50ABE7;
    transition: all 0.4s;
  }
}
</style>