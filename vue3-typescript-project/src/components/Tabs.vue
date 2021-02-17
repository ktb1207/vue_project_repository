<template>
  <div class="row-tabs" ref="rowTab">
    <div
      v-for="(item, index) in itemArr"
      :key="index + 'cc'"
      class="tab-item"
      :class="[selectTabIndex === index ? 'active-tab' : '']"
      @click="tabClick(index)"
    >
      <span>{{ item }}</span>
    </div>
    <div class="tab-line" :style="{ width: tabLineWidth + 'px', transform: `translateX(${lineOffset}px)` }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, PropType, Ref, ref } from 'vue';

interface IProps {
  activeIndex: number;
  itemArr: Array<string>;
}

const Tabs = defineComponent({
  props: {
    activeIndex: {
      type: Number,
      default: 0,
      required: false
    },
    itemArr: {
      type: Array as PropType<Array<string>>,
      default() {
        return [];
      },
      required: false
    }
  },
  setup(props, context) {
    // ref
    const rowTab = ref<HTMLDivElement>();
    // 滑动线条宽
    const tabLineWidth = ref<number>(0);
    // 增加宽度
    const addLineWidth = ref<number>(40);
    // 滑动线条左偏移
    const lineOffset = ref<number>(0);
    // 选择索引
    const selectTabIndex = ref<number>((props as IProps).activeIndex);
    /**
     * @description: tab item 点击事件
     * @param {*}
     * @return {*}
     * @author kongtb
     */
    function tabClick(inx: number): void {
      selectTabIndex.value = inx;
      context.emit('tab-click', inx);
    }
    /**
     * @description: 下滑线移动计算
     * @param {*}
     * @return {*}
     * @author kongtb
     * */
    function moveLine(): void {
      const tabItem = (rowTab.value as HTMLDivElement).children;
      for (let i = 0; i < tabItem.length; i++) {
        if (tabItem[i].className.includes('active-tab')) {
          const parentOffsetLeft: number = (tabItem[i] as HTMLDivElement).offsetLeft;
          const parentWidth: number = parseInt(window.getComputedStyle(tabItem[i]).width);
          const activeSpan = tabItem[i].children[0];
          const activeSelfWidth: number = parseInt(window.getComputedStyle(activeSpan).width) + addLineWidth.value;
          tabLineWidth.value = activeSelfWidth;
          lineOffset.value = parentOffsetLeft + parseInt(((parentWidth - activeSelfWidth) / 2).toFixed(2));
        }
      }
    }
    onMounted(() => {
      moveLine();
    });
    onUpdated(() => {
      moveLine();
    });
    return {
      selectTabIndex,
      tabLineWidth,
      lineOffset,
      tabClick,
      rowTab
    };
  }
});
export default Tabs;
</script>

<style lang="scss" scoped>
.row-tabs {
  height: 117px;
  line-height: 117px;
  font-size: 28px;
  color: #333;
  background-color: #fff;
  box-shadow: 0px 0px 10px 0px rgba(35, 24, 21, 0.18);
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  & > .tab-item {
    flex: 1 1 auto;
    text-align: center;
    cursor: pointer;
    span {
      display: inline-block;
    }
  }
  & > .active-tab {
    color: #50abe7;
  }
  & > .tab-line {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 4px;
    background-color: #50abe7;
    transition: all 0.4s;
  }
}
</style>
