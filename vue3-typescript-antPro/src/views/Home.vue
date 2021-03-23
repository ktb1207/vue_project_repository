<template>
  <div class="root-router-page home-page">
    <div class="table-wrp">
      <KTable :columns="columnsData" :rowData="bodyData"></KTable>
    </div>

    <div class="test-wrp">
      <div class="flex-one">1</div>
      <div class="flex-one">2</div>
      <div class="flex-one">3</div>
      <div class="flex-two">skdhfskhfsdskjdhfskdjhfkdsjfskjhfskjdhkjfdhkshfd</div>
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
    width: '660px',
    align: 'center'
  },
  {
    label: '班级',
    prop: 'classify',
    width: '160px',
    align: 'right'
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
    height: 160px;
    overflow: auto;
  }

  .test-wrp {
    height: 32px;
    background-color: chartreuse;
    display: flex;
    overflow: auto;
    .flex-one {
      flex: 0 0 150px;
      width: 0;
      background-color: chocolate;
      margin-left: 5px;
    }
    .flex-two {
      flex: 1 1 auto;
      width: 0;
      background-color: cornflowerblue;
      margin-right: 5px;
    }
  }
}
</style>
