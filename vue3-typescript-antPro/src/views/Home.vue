<template>
  <div class="root-router-page home-page">
    <div class="table-wrp">
      <KTable :columns="columnsData" :rowData="bodyData"></KTable>
    </div>
    <div class="test-wrp">
      <KTablePlus :rowData="bodyData">
        <KColumnPlus label="名称" prop="name" width="180px" align="center"></KColumnPlus>
        <KColumnPlus label="班级" prop="classify"></KColumnPlus>
        <KColumnPlus label="分数" prop="num">
          <template #default="scope">
            <button @click="hTestClick(scope)">button</button>
          </template>
        </KColumnPlus>
      </KTablePlus>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import useAuthority from '@/utils/authority';
import KTable from '@/components/k-table/KTable.vue';
import { ColumnItem } from '@/components/k-table/KTable.vue';

import KTablePlus from '@/components/k-table-plus/KTablePlus';
import KColumnPlus from '@/components/k-table-plus/KColumnPlus';
type tableRowItem = {
  name: string;
  classify: string;
  num: number;
};
const testFunction = () => {
  console.log('click');
};
const tableColumns: Array<ColumnItem> = [
  {
    label: '名称',
    prop: 'name',
    width: '100px',
    align: 'center',
    render: () => {
      return `<button onclick="${testFunction()}">button</button>`;
    }
  },
  {
    label: '班级',
    prop: 'classify',
    width: '400px',
    align: 'right'
  },
  {
    label: '分数',
    prop: 'num',
    width: '100px'
  }
];
export default defineComponent({
  components: {
    KTable,
    KTablePlus,
    KColumnPlus
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
    const hTestClick = (scope: any) => {
      console.log(scope);
    };
    return {
      columnsData,
      bodyData,
      hTestClick
    };
  }
});
</script>

<style lang="scss">
.home-page {
  padding: 24px;
  .table-wrp {
    width: 900px;
    overflow: auto;
  }
  .test-wrp {
    margin: 30px auto;
    width: 600px;
  }
}
</style>
