<style lang="less">
.table-tree-wrp {
  padding: 14px 24px;
  .container-wrp {
    height: 580px;
    width: 960px;
    border: 1px solid red;
  }
}
</style>
<template>
  <div class="table-tree-wrp">
    <back-home></back-home>
    <button @click="testMethods()">测试树数据构建</button>
    <div class="container-wrp">
      <tree-table parent-id-name="pid"
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
      ],
      treeDataTest: [
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
    },
    // 测试按钮点击
    testMethods() {
      // let treeData = this.transformDataToTreeOne(this.treeDataTest);
      let treeData2 = this.transformDataToTreeByObject(this.treeDataTest);
      console.log(treeData2);
    },
    /**
     * 平行数据转树结构数据方法汇总-1
     * 1.先找出所有根节点
     * 2.递归构建
     */
    transformDataToTreeOne(arr) {
      console.log('计时开始：' + new Date().getMilliseconds());
      let dataArray = []; // 保存根节点item
      let rootIdArr = []; //保存添加根节点id
      arr.forEach((item, index) => {
        if (item['pid'] == null || item['pid'] == '') {
          dataArray.push(item);
          rootIdArr.push(item.id);
        }
      });
      return this.dataTreeDG(arr, dataArray, rootIdArr);
    },
    //递归所有数据，创建tree结构
    dataTreeDG(datas, dataArray, rootArr) {
      /*
       *@param {Object} datas  所有数据
       *@param {Object} dataArray 父节点组成的数组
       */
      for (var j = 0; j < dataArray.length; j++) {
        var dataArrayIndexItem = dataArray[j]; // 循环当前项
        var childrenArray = []; // 为当前项创建children空数组
        var parentCode = dataArrayIndexItem.id; // 当前项id
        for (var i = 0; i < datas.length; i++) {
          var data = datas[i];
          var toCode = data['pid']; //
          if (toCode == parentCode) {
            //判断是否为儿子节点
            childrenArray.push(datas[i]);
          }
        }
        dataArrayIndexItem['children'] = childrenArray;
        if (childrenArray.length > 0) {
          //有儿子节点则递归
          var createRootArr = []; //继承保存添加根节点id
          childrenArray.forEach((item, index) => {
            createRootArr.push(item.rootId);
          });
          this.dataTreeDG(datas, childrenArray, createRootArr);
        }
      }
      console.log('数据构建完成:' + new Date().getMilliseconds());
      return dataArray;
    },
    /**
     * 使用object快速构建树数据结构
     *
     */
    transformDataToTreeByObject(list) {
      console.log('计时开始：' + new Date().getMilliseconds());
      //创建一个对象命名为map
      var map = {};
      //通过遍历把list中的元素放到map对象中
      list.forEach(item => {
        item['children'] = [];
        if (!map[item.id]) {
          //核心步骤1：map中的'item.id'属性指向list数组中的对象元素
          map[item.id] = item;
        }
      });
      //再次遍历为了对map属性所指的对象进行处理
      list.forEach(item => {
        //过滤父级id不是null的元素
        if (item['pid'] != null) {
          //map[item.pid]为该元素的父级元素
          map[item['pid']].children.push(item);
        }
      });
      //过滤后仅剩下根节点
      let filterArr = list.filter(item => {
        if (item['pid'] === null) {
          return item;
        }
      });
      console.log('数据构建完成:' + new Date().getMilliseconds());
      return filterArr;
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {});
  },
  updated() {},
  beforeDestroy() {}
};
</script>
