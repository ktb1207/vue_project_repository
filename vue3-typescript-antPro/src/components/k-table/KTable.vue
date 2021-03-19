<template>
  <table border="1" ref="tableDom" class="k-table">
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
    <tbody>
      <tr v-for="(item, index) in rowData" :key="index">
        <td v-for="col in tableColumns" :key="col.prop">{{ item[col.prop] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, SetupContext, PropType, toRef, onMounted, ref } from 'vue';

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
      (tableDom.value as any).addEventListener('mousemove', (e: MouseEvent) => {
        console.log(resizeStatus);
        if (resizeStatus) {
          console.log(e);
        }
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
.k-table {
  width: 100%;
  position: relative;
  .header-td {
    position: relative;
    .resize-span {
      display: inline-block;
      position: absolute;
      right: -2px;
      top: 0px;
      bottom: 0px;
      width: 3px;
      background-color: blue;
      cursor: col-resize;
      z-index: 2;
    }
  }
}
</style>
