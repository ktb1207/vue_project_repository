<style lang="less">
  .table-tree-wrp{
    padding:14px 24px;
    .container-wrp{
      height:580px;
      width:960px;
      border:1px solid red;
    }
  }
</style>
<template>
  <div class="table-tree-wrp">
    <back-home></back-home>
    <div class="container-wrp">
      <tree-table
        parent-id-name="pid"
        :columns="columnsData"
        :tree-data="treeTableData"
        :exist-data="treeTableData.length > 0 ? true : false"
        :relation-check="true"
        @checkRow="treeCheckChange"></tree-table>
    </div>
  </div>
</template>
<script>
import BackHome from '../components/BackHome';
import TreeTable from '../components/treeTable/TreeWrp.vue';
export default {
  name: 'tableTreeDemo',
  props: {},
  data() {
    return {
      columnsData: [
        {
          type: 'selection',
          title: '选择',
          width: '80px',
          align: 'center',
          grow: 0,
          edit: false
        },
        {
          type: 'node',
          title: '名称',
          key: 'name',
          width: 'auto',
          align: 'left',
          grow: 1,
          edit: false
        },
        {
          type: 'text',
          title: '数量',
          key: 'number',
          width: '120px',
          align: 'center',
          grow: 0,
          edit: false
        }
      ],
      treeTableData: [
        {
          id: '1',
          pid: null,
          name: '广联达一期',
          number: 120
        },
        {
          id: '11',
          pid: '1',
          name: '一层楼',
          number: 24,
          checked: true
        },
        {
          id: '12',
          pid: '1',
          name: '二层楼',
          number: 48,
          checked: true
        },
        {
          id: '111',
          pid: '11',
          name: '104会议室',
          number: 50
        },
        {
          id: '112',
          pid: '11',
          name: '108会议室',
          number: 60,
          checked: false
        },
        {
          id: '121',
          pid: '12',
          name: '201会议室',
          number: 32
        },
        {
          id: '122',
          pid: '12',
          name: '207会议室',
          number: 68
        },
        {
          id: '2',
          pid: null,
          name: '广联达二期',
          number: 240,
          disabled: true
        },
        {
          id: '21',
          pid: '2',
          name: '五层楼',
          number: 140
        },
        {
          id: '211',
          pid: '21',
          name: '505会议室',
          number: 74
        }
      ]
    };
  },
  computed: {},
  components: {
    BackHome,
    TreeTable
  },
  watch: {},
  methods: {
    treeCheckChange(arr) {
      console.log('当前勾选：' + arr);
    }
  },
  created() {},
  mounted() {},
  updated() {},
  beforeDestroy() {}
};
</script>
