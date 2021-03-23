<template>
  <div class="k-table-wrp">
    <div class="k-table-layout">
      <!-- 固定表头 -->
      <div class="table-header" ref="tableDom">
        <div
          class="k-td"
          draggable="true"
          v-for="(item, index) in tableColumns"
          :key="item.prop"
          @dragstart="onDragStart(index)"
          @dragover="onDragOver($event)"
          @drop="onDrop($event, index)"
          :style="{
            flex: item.width ? `0 0 ${item.width}` : '1 1 auto',
            textAlign: item.align ? item.align : 'left'
          }"
        >
          {{ item.label }}
          <span
            class="resize-span"
            @mousedown="resizeStart($event)"
            @mouseup="resizeEnd($event)"
            v-show="index < tableColumns.length - 1"
          ></span>
        </div>
      </div>
      <!-- 滚动表体 -->
      <!-- <div class="table-body">
        <div class="k-tr" v-for="(item, index) in rowData" :key="index">
          <div
            class="k-td"
            v-for="col in tableColumns"
            :key="col.prop"
            :style="{ flex: col.width ? `0 0 ${col.width}` : '1 1 auto', textAlign: col.align ? col.align : 'left' }"
          >
            {{ item[col.prop] }}
          </div>
        </div>
      </div> -->
      <!-- 拖拽线 -->
      <div class="resize-line"></div>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * 约定：表格单元列最后一列宽度必须auto,以此消除滚动表格滚动条对表格列边框对齐影响
 * */

import { defineComponent, SetupContext, PropType, toRef, onMounted, ref, nextTick } from 'vue';

export type ColumnItem = {
  // 标题名称
  label: string;
  // 标题数据字段
  prop: string;
  // 单元列宽
  width?: string;
  // 单元格对齐方式
  align?: string;
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
    let resizeStatus = false;
    // 表格列数据
    const tableColumns = toRef(props, 'columns');
    // 表格ref引用
    const tableDom = ref(null);
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
        const preIndex = Math.min(inx1, inx2);
        const preWidth = tableColumns.value[preIndex].width;
        tableColumns.value[nowEndIndex].width = preWidth;
        delete tableColumns.value[preIndex].width;
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

    // 列调整-开始
    const resizeStart = (e: MouseEvent): void => {
      e.preventDefault();
      resizeStatus = true;
      console.log('列宽调整开始..');
      console.log(e);
      console.log((e.target as HTMLSpanElement).offsetLeft);
    };
    // 列调整-结束
    const resizeEnd = (e: MouseEvent): void => {
      e.preventDefault();
      resizeStatus = false;
      console.log('列宽调整结束..');
      console.log(e);
      console.log((e.target as HTMLSpanElement).offsetLeft);
    };
    onMounted(() => {
      nextTick(() => {
        console.log(((tableDom.value as unknown) as HTMLTableElement).firstChild);
      });
      // const tableDomRef = (tableDom.value as unknown) as HTMLTableElement;
      // tableDomRef.addEventListener('mousemove', (e: MouseEvent) => {
      //   console.log(e.offsetX);
      //   console.log((e.target as HTMLTableElement).scrollWidth);
      // });
    });
    return {
      tableColumns,
      onDragStart,
      onDragOver,
      onDrop,
      tableDom,
      //
      resizeStart,
      resizeEnd
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
.k-table-wrp {
  width: 100%;
  height: 100%;
  overflow-x: auto; // 横向滚动
  overflow-y: hidden;
  position: relative;
}
.k-table-layout {
  height: 100%;
  overflow-y: hidden;
  position: relative;
  border: 1px solid $borderColor;
  padding-bottom: 8px; // 消除底部边框重合
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .table-header {
    flex: 0 0 auto;
    height: 0;
    height: $headerHeight;
    border-bottom: 1px solid $borderColor;
    white-space: nowrap;
    display: inline-block;
    .k-td {
      display: inline-block;
      width: 320px;
      cursor: move;
      line-height: $headerHeight;
      position: relative;
      .resize-span {
        display: inline-block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 3px;
        background-color: blue;
        cursor: col-resize;
        z-index: 4;
      }
    }
  }
  .table-body {
    flex: 1 1 auto;
    height: 0;
    overflow-y: auto; // 垂直方向滚动
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 6px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #53626f;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      background: #d4dde6;
    }
  }
  .k-tr {
    height: $bodyRowHeight;
    border-bottom: 1px solid $borderColor;
    .k-td {
      line-height: $bodyRowHeight;
    }
  }
  .k-tr {
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
    .k-td {
      position: relative;
      padding-left: 12px;
      padding-right: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-right: 1px solid $borderColor;
      &:last-child {
        border-right: none;
      }
    }
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
