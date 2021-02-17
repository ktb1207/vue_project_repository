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
import { Options, Vue } from 'vue-class-component';
import { Prop, Ref, Emit } from 'vue-property-decorator';
@Options({
  emits: ['tab-click']
})
export default class Tabs extends Vue {
  // 默认选中项索引
  @Prop({ type: Number, default: 0 })
  activeIndex!: number;
  // tab item
  @Prop({ type: Array, default: [] })
  itemArr?: Array<string>;
  // ref
  @Ref('rowTab') readonly div!: HTMLDivElement;

  get rowTabRef(): HTMLDivElement {
    return this.$refs.rowTab as HTMLDivElement;
  }

  //data
  // 滑动线条宽
  tabLineWidth: number = 0;
  // 增加宽度
  addLineWidth: number = 40;
  // 滑动线条左偏移
  lineOffset: number = 0;
  // 选择索引
  selectTabIndex: number = this.activeIndex;

  mounted() {
    this.$nextTick(() => {
      this.moveLine();
    });
  }
  updated() {
    this.$nextTick(() => {
      this.moveLine();
    });
  }

  /**
   * @description: tab 点击
   * @param {*}
   * @return {*}
   * @author kongtb
   * */
  @Emit()
  tabClick(inx: number): void {
    this.selectTabIndex = inx;
  }
  /**
   * @description: 下滑线移动计算
   * @param {*}
   * @return {*}
   * @author kongtb
   * */
  moveLine(): void {
    const tabItem = this.rowTabRef.children;
    for (let i = 0; i < tabItem.length; i++) {
      if (tabItem[i].className.includes('active-tab')) {
        const parentOffsetLeft: number = (tabItem[i] as HTMLDivElement).offsetLeft;
        const parentWidth: number = parseInt(window.getComputedStyle(tabItem[i]).width);
        const activeSpan = tabItem[i].children[0];
        const activeSelfWidth: number = parseInt(window.getComputedStyle(activeSpan).width) + this.addLineWidth;
        this.tabLineWidth = activeSelfWidth;
        this.lineOffset = parentOffsetLeft + parseInt(((parentWidth - activeSelfWidth) / 2).toFixed(2));
      }
    }
  }
}
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
