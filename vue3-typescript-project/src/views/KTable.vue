<template>
  <div class="router-view">
    <div class="table-wrp" ref="tableScroll">
      <table border="1" cellpadding="0" cellspacing="0" class="k-table">
        <colgroup>
          <col width="180" />
          <col width="180" />
          <col width="180" />
        </colgroup>
        <thead :style="theadStyle">
          <tr>
            <td>姓名</td>
            <td>班级</td>
            <td>年龄</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>张三</td>
            <td>五四班</td>
            <td>890</td>
          </tr>
          <tr>
            <td>张a</td>
            <td>五四班</td>
            <td>890</td>
          </tr>
          <tr>
            <td>张b</td>
            <td>五四班</td>
            <td>890</td>
          </tr>
          <tr>
            <td>张c</td>
            <td>五四班</td>
            <td>890</td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" width="180">
        <template #header>
          <div draggable="true">日期</div>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>

      <el-table-column prop="address" label="地址" draggable="true"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from 'vue';

export default defineComponent({
  name: 'ktable',
  setup() {
    const tableScroll = ref(null);
    const ytop = ref(0);

    const theadStyle = computed(() => {
      const yValue = ytop.value;

      return {
        transform: `translate3d(0px,${yValue > 0 ? yValue + 'px' : '0px'},0px)`
      };
    });
    onMounted(() => {
      console.log(tableScroll.value);
      const scrollDom = tableScroll.value;

      scrollDom.addEventListener('scroll', (e) => {
        console.log(e.target.scrollTop);
        ytop.value = e.target.scrollTop;
      });
    });
    return {
      tableScroll,
      theadStyle
    };
  },
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    };
  }
});
</script>

<style lang="scss">
.table-wrp {
  height: 96px;
  width: 320px;
  overflow: auto;
  .k-table {
    table-layout: fixed;
    thead {
      background-color: red;
      transform: translate3d(0px, 0, 0px);
    }
  }
}
</style>
