<template>
  <div class="root-router-page home-page">
    <div class="table-wrp">
      <KTable :columns="columnsData" :rowData="bodyData"></KTable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import useAuthority from '@/utils/authority';

import KTable from '@/components/k-table/KTable.vue';
import { ColumnItem } from '@/components/k-table/KTable.vue';
type tableRowItem = {
  name: string;
  classify: string;
  num: number;
};
const tableColumns: Array<ColumnItem> = [
  {
    label: '名称',
    prop: 'name',
    width: '160'
  },
  {
    label: '班级',
    prop: 'classify',
    width: '160'
  },
  {
    label: '分数',
    prop: 'num'
  }
];
export default defineComponent({
  components: {
    KTable
  },
  setup() {
    // 页面范文权限
    useAuthority('A');
    const columnsData = reactive(tableColumns);
    const bodyData = reactive<Array<tableRowItem>>([
      {
        name: '张三',
        classify: '三二班',
        num: 801234567890012345
      },
      {
        name: '李四',
        classify: '四二班',
        num: 77
      },
      {
        name: '1111',
        classify: '四二班',
        num: 77
      },
      {
        name: '222',
        classify: '四二班',
        num: 77
      }
    ]);
    return {
      columnsData,
      bodyData
    };
  }
});
</script>

<style lang="scss">
.home-page {
  padding: 24px;
  .table-wrp {
    height: 80px;
    overflow: auto;
  }
}
</style>
