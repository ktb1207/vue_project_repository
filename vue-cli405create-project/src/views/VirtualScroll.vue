<template>
  <div class="virtual-scroll">
    <div
      class="scroll-box"
      @scroll="onScrollHandle"
    >
      <ul
        class="wrap"
        :style="`height:${wrapHeight}px`"
      >
        <li
          class="item"
          v-for="v of renderList"
          :key="v.id"
          :style="`color:${v.color};top:${20 * v.id}px`"
        >{{v.id}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
const viewportHeight = 400;
const viewportItemHeight = 20;
const viewportItemCount = 100000;
export default {
  data () {
    const list = Array(viewportItemCount)
      .fill(1)
      .map((v, i) => {
        const color = '#' + Math.floor(Math.random() * 256 ** 3).toString(16);
        const id = i;
        return {
          color,
          id
        };
      });
    return {
      list,
      renderList: [],
      wrapHeight: 0
    };
  },
  created () {
    this.wrapHeight = viewportItemHeight * viewportItemCount; // 可滚动区域高度
    this.renderList = this.calcluteRenderList(0); // 渲染显示列表个数
  },
  methods: {
    calcluteRenderList (scrollTop) {
      const renderCount = viewportHeight / viewportItemHeight + 10; // （可视区域高度）/（每一条列表高度）= 可显示条数 + 10（滚动缓存条数）
      const renderTopCount = Math.floor(scrollTop / viewportItemHeight); // (滚动条滚动的距离) / (每一条列表行高) 如 330/20 = 16.5取整等于16，即列表向上滚动的条数
      return this.list.slice(renderTopCount, renderTopCount + renderCount); // 截取总列表条数（向上滚动条数，向上滚动条数 + 需要渲染条数）
    },
    onScrollHandle (e) {
      console.log(e.target.scrollTop);
      this.renderList = this.calcluteRenderList(e.target.scrollTop);
    }
  }
};
</script>
<style lang="less">
.virtual-scroll {
  height: 100%;
  .scroll-box {
    overflow-y: scroll;
    height: 400px;
    background-color: #dce1e6;
    .wrap {
      overflow: hidden;
      padding: 0;
      margin: 0;
      position: relative;

      .item {
        height: 20px;
        position: absolute;
        list-style: none;
      }
    }
  }
}
</style>
