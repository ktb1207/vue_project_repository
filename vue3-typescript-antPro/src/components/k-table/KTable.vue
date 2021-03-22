<template>
  <div class="table-layout">
    <!-- 表头表格 -->
    <table ref="tableDom" class="k-table-header">
      <thead>
        <tr>
          <td
            class="header-td"
            draggable="true"
            v-for="(item, index) in tableColumns"
            :key="item.prop"
            :width="item.width ? item.width : 'auto'"
            @dragstart="onDragStart(index)"
            @dragover="onDragOver($event)"
            @drop="onDrop($event, index)"
          >
            {{ item.label }}
            <span
              class="resize-span"
              @mousedown="resizeStart($event)"
              @mouseup="resizeEnd($event)"
              v-show="index < tableColumns.length - 1"
            ></span>
          </td>
        </tr>
      </thead>
    </table>
    <!-- 表格内容 -->
    <div class="auto-table">
      <table class="k-table-body">
        <thead>
          <tr>
            <td v-for="item in tableColumns" :key="item.prop" :width="item.width ? item.width : 'auto'"></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in rowData" :key="index">
            <td v-for="col in tableColumns" :key="col.prop">{{ item[col.prop] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="resize-line"></div>
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
        tableColumns.value[preIndex].width = 'auto';
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

<style lang="scss">
$headerHeight: 32px;
$borderColor: #565656;
.table-layout {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  // header
  .k-table-header {
    flex: 0 0 auto;
    width: 100%;
    position: relative;
    table-layout: fixed;
    .header-td {
      position: relative;
      cursor: move;
      .resize-span {
        display: inline-block;
        position: absolute;
        right: 0;
        top: 0px;
        bottom: 0px;
        width: 6px;
        background-color: blue;
        cursor: col-resize;
        z-index: 4;
      }
    }
  }
  // body
  .auto-table {
    flex: 1 1 auto;
    overflow-y: auto;
    border-bottom: 1px solid $borderColor;
    padding-bottom: 2px;
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
    .k-table-body {
      width: 100%;
      position: relative;
      table-layout: fixed;
    }
  }

  // 边框线
  .k-table-header,
  .k-table-body {
    tr {
      border: 1px solid $borderColor;
      td {
        border-right: 1px solid $borderColor;
      }
    }
  }
  // 边框重叠消除
  .k-table-body {
    thead {
      tr {
        border: none;
      }
    }
    tbody {
      & > tr:first-child {
        border-top: none;
      }
    }
  }
  // 单元格禁止换行，移除...
  td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
