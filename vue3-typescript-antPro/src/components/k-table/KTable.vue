<template>
  <div class="k-table-layout" ref="tableScroll">
    <table class="table-container">
      <thead :style="theadStyle">
        <tr class="header-tr">
          <td
            draggable="true"
            v-for="(item, index) in tableColumns"
            :key="item.prop"
            :style="{ width: item.width ? item.width : 'auto', textAlign: item.align ? item.align : 'left' }"
            @dragstart="onDragStart(index)"
            @dragover="onDragOver($event)"
            @drop="onDrop($event, index)"
          >
            {{ item.label }}
            <span
              class="resize-span"
              v-show="index < tableColumns.length - 1"
              @mousedown="handleMouseDown($event, index)"
            ></span>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr class="body-tr" v-for="(item, index) in rowData" :key="index">
          <td v-for="col in tableColumns" :key="col.prop" :style="{ textAlign: col.align ? col.align : 'left' }">
            <span v-if="col.render" v-html="col.render()"></span>
            <span v-else>{{ item[col.prop] }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 拖拽线 -->
    <div class="resize-line" :style="{ left: resizeLineLeft + 'px' }"></div>
  </div>
</template>

<script lang="ts">
/**
 * 约定：每一个列项需要指定width
 * */

import { defineComponent, SetupContext, PropType, toRef, onMounted, ref, computed } from 'vue';

export type ColumnItem = {
  // 标题名称
  label: string;
  // 标题数据字段
  prop: string;
  // 单元列宽
  width: string;
  // 单元格对齐方式
  align?: string;
  render?: () => {};
};

interface Props {
  columns: Array<ColumnItem>;
  rowData: Array<any>;
}

export default defineComponent({
  name: 'KTable',
  props: {
    columns: {
      type: Array as PropType<Array<ColumnItem>>,
      default: () => []
    },
    rowData: {
      type: Array as PropType<Array<any>>,
      default: () => []
    }
  },
  setup(props: Props, context: SetupContext) {
    console.log(props);
    console.log(context);
    let dragActiveIndex = 0;
    let dragDropIndex = 0;
    // 表格列数据
    const tableColumns = toRef(props, 'columns');
    // 表格容器
    const tableScroll = ref<HTMLDivElement | null>(null);
    // 表格垂直滚动px
    const correctTop = ref<number>(0);
    const theadStyle = computed(() => {
      const yValue = correctTop.value;
      return {
        transform: `translate3d(0px,${yValue > 0 ? yValue + 'px' : '0px'},0px)`
      };
    });
    // 交换列数据
    function exchangeArrayByIndex(inx1: number, inx2: number): void {
      const maxLength = tableColumns.value.length - 1;
      if (inx1 === inx2) {
        return;
      }
      if (inx1 > maxLength || inx2 > maxLength) {
        return;
      }
      // 最后单元列参与排序，修改新排序单元列宽度
      if (inx1 === maxLength || inx2 === maxLength) {
        console.log('最后一列参与排序了');
        const nowEndIndex = Math.max(inx1, inx2);
        const nowEndWidth = tableColumns.value[nowEndIndex].width;
        const preIndex = Math.min(inx1, inx2);
        const preWidth = tableColumns.value[preIndex].width;
        tableColumns.value[nowEndIndex].width = preWidth;
        tableColumns.value[preIndex].width = nowEndWidth;
      }
      tableColumns.value.splice(inx1, 1, ...tableColumns.value.splice(inx2, 1, tableColumns.value[inx1]));
    }
    // 排序-开始拖动
    const onDragStart = (activeIndex: number): void => {
      dragActiveIndex = activeIndex;
    };
    // 排序-允许放置
    const onDragOver = (e: DragEvent): void => {
      e.preventDefault();
    };
    // 排序放置事件
    const onDrop = (e: DragEvent, dropIndex: number): void => {
      e.preventDefault();
      dragDropIndex = dropIndex;
      exchangeArrayByIndex(dragActiveIndex, dragDropIndex);
    };
    const resizeLineLeft = ref<number>(-2000);
    type resizeInfo = {
      // 调整列索引
      nowResizeTdIndex: number;
      // 开始x坐标
      startPoint: number;
      // 开始相对table左侧距离
      relativeTableLeft: number;
      // 开始td宽度
      originalTdWidth: number;
      // td左侧坐标
      originalTdLeftPoint: number;
      // 调整td最终宽度
      endReviseTdWidth: number;
    };
    const resizeState = ref<resizeInfo>({
      nowResizeTdIndex: 0,
      startPoint: 0,
      relativeTableLeft: 0,
      originalTdWidth: 0,
      originalTdLeftPoint: 0,
      endReviseTdWidth: 0
    });
    // 列调整
    const handelMouseMove = (e: MouseEvent) => {
      console.log(e);
      // 鼠标移动point与开始point差值
      const deltaLeft = e.clientX - resizeState.value.startPoint;
      // 最小宽度限制50
      const minLeft = resizeState.value.originalTdLeftPoint + 50;
      // 实时移动差值
      const proxyLeft = resizeState.value.relativeTableLeft + deltaLeft;
      // 标注线最终位置
      const moveLineEndPoint = Math.max(minLeft, proxyLeft);
      // 标注线开始到结束位置差值,+ 变大 - 变小
      const moveLineDiffByEndAndStart = moveLineEndPoint - resizeState.value.relativeTableLeft;
      resizeState.value.endReviseTdWidth = resizeState.value.originalTdWidth + moveLineDiffByEndAndStart;
      // 标注线移动
      resizeLineLeft.value = moveLineEndPoint;
    };
    const handelMouseUp = () => {
      resizeLineLeft.value = -2000;
      tableColumns.value[resizeState.value.nowResizeTdIndex].width = resizeState.value.endReviseTdWidth + 'px';
      document.removeEventListener('mousemove', handelMouseMove);
      document.removeEventListener('mouseup', handelMouseUp);
    };
    // 列调整-开始
    const handleMouseDown = (e: MouseEvent, index: number): void => {
      e.preventDefault();
      console.log('列宽调整开始..');
      const target = e.target as HTMLSpanElement;
      const parentNode = target.parentNode as HTMLTableColElement;
      const columnRect = parentNode.getBoundingClientRect();
      const tableRef = tableScroll.value as HTMLDivElement;
      const tableLeft = tableRef.getBoundingClientRect().left;
      // console.log((e.target as HTMLSpanElement).offsetLeft);
      console.log(columnRect.right);
      console.log(tableLeft);
      resizeState.value = {
        nowResizeTdIndex: index,
        startPoint: e.clientX,
        relativeTableLeft: columnRect.right - tableLeft,
        originalTdWidth: columnRect.right - columnRect.left,
        originalTdLeftPoint: columnRect.left,
        endReviseTdWidth: columnRect.right - columnRect.left
      };
      resizeLineLeft.value = resizeState.value.relativeTableLeft;
      document.addEventListener('mousemove', handelMouseMove);
      document.addEventListener('mouseup', handelMouseUp);
    };
    onMounted(() => {
      // 固定表头
      const scrollDom = (tableScroll.value as unknown) as HTMLDivElement;
      scrollDom.addEventListener('scroll', (e) => {
        correctTop.value = (e.target as HTMLDivElement).scrollTop;
      });
    });
    return {
      // 单元列
      tableColumns,
      // 拖拽
      onDragStart,
      onDragOver,
      onDrop,
      // 列宽
      handleMouseDown,
      //dom
      tableScroll,
      //style
      theadStyle,
      resizeLineLeft
    };
  }
});
</script>

<style lang="scss" scoped>
$headerHeight: 38px;
$bodyRowHeight: 32px;
$borderColor: #565656;
div {
  box-sizing: border-box;
}

.k-table-layout {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  // &::-webkit-scrollbar {
  //   /*滚动条整体样式*/
  //   width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  //   height: 1px;
  // }
  // &::-webkit-scrollbar-thumb {
  //   /*滚动条里面小方块*/
  //   border-radius: 6px;
  //   box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  //   background: #53626f;
  // }
  // &::-webkit-scrollbar-track {
  //   /*滚动条里面轨道*/
  //   box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  //   border-radius: 6px;
  //   background: #d4dde6;
  // }
  .table-container {
    table-layout: fixed;
    width: 100%;
    // header
    .header-tr {
      height: $headerHeight;
      border: 1px solid red;
      td {
        position: relative;
        cursor: move;
      }
    }
    // body
    .body-tr {
      height: $bodyRowHeight;
      background-color: bisque;
      border: 1px solid gold;
    }
    td {
      padding: 0 12px;
      border-right: 1px solid #999;
      white-space: nowrap;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .resize-span {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 6px;
    background-color: blue;
    cursor: col-resize;
  }
  // 拖拽线
  .resize-line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -1999px;
    width: 1px;
    background-color: rgb(94, 255, 0);
    z-index: 2;
  }
}
</style>
