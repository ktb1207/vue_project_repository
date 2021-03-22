<template>
  <div class="router-view">
    <div class="center-wrp" @mousedown="wrpDown($event)">
      <div class="inner-wrp" @mousedown="innerDown($event)"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Coordinate',
  setup() {
    // 外点击
    const wrpDown = (e: MouseEvent): void => {
      e.stopPropagation();
      console.log('外dom:');
      console.log(e);
    };
    // 内点击
    const innerDown = (e: MouseEvent): void => {
      e.stopPropagation();
      console.log('内dom:');
      console.log(e);
    };
    return {
      wrpDown,
      innerDown
    };
  }
});
/**
 * 鼠标事件属性
 *
 * clientX：当鼠标事件发生时（不管是onclick，还是omousemove，onmouseover等），鼠标相对于浏览器（这里说的是浏览器的有效区域）x轴的位置,仅仅对于可视区域，不包含滚动条影响；
 *
 * clientY：当鼠标事件发生时，鼠标相对于浏览器（这里说的是浏览器的有效区域）y轴的位置,仅仅对于可视区域，不包含滚动条影响；
 *
 * offsetX：当鼠标事件发生时，鼠标相对于事件源x轴的位置,出现滚动条情况下，有可能大于clientX
 *
 * offsetY：当鼠标事件发生时，鼠标相对于事件源y轴的位置，出现滚动条情况下，有可能大于clientY
 *
 * pageX：当鼠标事件发生时，鼠标相对于文档页面的X轴的位置，浏览器没有滚动条的时候，pageX的值就和clientX的值是一致，出现滚动条情况下，pageX-clientX=左右可滚动宽度值
 *
 * pageY: 当鼠标事件发生时，鼠标相对于文档页面的Y轴的位置，浏览器没有滚动条的时候，pageY的值就和clientY的值是一致，出现滚动条情况下，pageY-clientY=垂直可滚动高度值
 *
 * screenX：当鼠标事件发生时，鼠标相对于显示器屏幕x轴的位置；
 *
 * screenY：当鼠标事件发生时，鼠标相对于显示器屏幕y轴的位置；
 *
 *
 * target:
 * target.clientHeight: 鼠标事件源对象的--内容实际高度 + 上下内边距。clientHeight = (content height) + (padding top+padding bottom);
 * target.clientWidth: 鼠标事件源对象的内容实际宽度 + 左右内边距。clientWidth = (content width) + (padding left+padding right);
 *
 * target.offsetHeight: 鼠标事件源对象的--内容实际高度 + 上下内边距+上下border。
 * target.offsetWidth: 鼠标事件源对象的--内容实际宽度 + 左右内边距+左右border。
 *
 *
 * clientLeft,clientTop:表示内容区域的左上角相对于整个元素左上角的位置
 * target.clientLeft: 鼠标事件源作用对象的左侧边框的宽度
 * target.clientTop：鼠标事件源作用对象的顶部侧边框的宽度
 *
 * offsetLeft,offsetTop:相对于最近的祖先定位元素
 * target.offsetLeft: 鼠标事件源对象，相对于最近的祖先定位元素的x轴偏移
 * target.offsetTop: 鼠标事件源对象，相对于最近的祖先定位元素的Y轴偏移
 *
 * scrollWidth和scrollHeight
 * target.scrollWidth: 鼠标事件对象的整体宽度，包括由于溢出而无法展示在网页的不可见部分。
 * target.scrollHeight: 鼠标事件对象的整体高度，包括由于溢出而无法展示在网页的不可见部分。
 *
 * scrollLeft 和scrollTop
 * target.scrollLeft: 鼠标事件对象，返回元素左边缘与视图之间的距离，视图指的是元素的内容（包括子元素以及内容）。
 * ** 没有滚动条情况下，等于0；
 * ** 有滚动条情况下，未滑动等于0，滑动代表滚动条距离左边的距离
 *
 * target.scrollTop: 同理
 * */
</script>

<style lang="scss">
.center-wrp {
  width: 100%;
  height: 320px;
  background-color: aqua;
  margin: 0 auto;
  overflow: hidden;
  // border: 2px solid red;
  .inner-wrp {
    height: 160px;
    width: 300px;
    margin: 32px auto;
    background-color: brown;
  }
}
</style>
