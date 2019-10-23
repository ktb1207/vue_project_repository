<style scoped>
.select-wrp {
  height: auto;
  width: 600px;
}
.tree-wrp {
  width: 600px;
  height: auto;
  overflow-x: auto;
}
</style>


<template>
  <div class="page-wrp">
    <div class="select-wrp">
      <drag-demo></drag-demo>
    </div>
    <div class="tree-wrp">
      <p>
        <button type="button" @click="switchSpread">一键展开/隐藏所有</button>
        当前选择节点项：{{showResult.name}}
      </p>
      <p>当前复选框勾选项有：{{checkAllArr}}</p>
      <tree-wrp
        :list-arr="treeData"
        :spread-all="spreadAll"
        :node-line="true"
        @clickResult="getSelectNode"
      ></tree-wrp>
    </div>
  </div>
</template>

<script>
import DragDemo from "../components/dragDemo.vue";
import TreeWrp from "../components/treeWrp.vue";
export default {
  data() {
    return {
      treeData: [
        {
          name: "河南省",
          id: 1,
          parentId: null
        },
        {
          name: "山西省",
          id: 2,
          parentId: null
        },
        {
          name: "陕西省",
          id: 3,
          parentId: null
        },
        {
          name: "浙江省",
          id: 4,
          parentId: null
        },
        {
          name: "开封",
          id: 11,
          parentId: 1
        },
        {
          name: "郑州",
          id: 12,
          parentId: 1
        },
        {
          name: "许昌",
          id: 13,
          parentId: 1
        },
        {
          name: "兰考",
          id: 111,
          parentId: 11
        },
        {
          name: "通许",
          id: 112,
          parentId: 11
        },
        {
          name: "西安",
          id: 31,
          parentId: 3
        },
        {
          name: "汉中",
          id: 32,
          parentId: 3
        },
        {
          name: "宝鸡",
          id: 33,
          parentId: 3
        },
        {
          name: "咸阳",
          id: 311,
          parentId: 31
        },
        {
          name: "太原",
          id: 21,
          parentId: 2
        },
        {
          name: "大同",
          id: 22,
          parentId: 2
        },
        {
          name: "吕梁",
          id: 211,
          parentId: 21
        },
        {
          name: "晋城",
          id: 23,
          parentId: 2
        },
        {
          name: "杭州",
          id: 41,
          parentId: 4
        },
        {
          name: "宁波",
          id: 42,
          parentId: 4
        }
      ],
      spreadAll: true,
      showResult: {
        id: "",
        name: ""
      },
      checkAllArr: [1, 2, 3],
      testArr: [4, 3, 1, 4, 8, 9, 6, 4, 0, 1, 5]
    };
  },
  computed: {},
  components: {
    DragDemo,
    TreeWrp
  },
  methods: {
    switchSpread() {
      this.spreadAll = !this.spreadAll;
    },
    getSelectNode(obj) {
      this.showResult = obj;
    },
    testEsArray() {
      //every,some,map,forEach都不会改变原数组
      //every 遇到false即停止循环
      let testEvery = this.testArr.every((item, index) => {
        //console.log(item);
        return item > 1;
      });
      console.log(testEvery);
      //some 遇到true即停止循环
      let testSome = this.testArr.some((item, index) => {
        //console.log(item);
        return item > 4;
      });
      console.log(testSome);
      //map 不会改变原数组
      let testMap = this.testArr.map((item, index) => {
        return item + 1;
      });
      console.log(this.testArr);
      console.log(testMap);
    }
  },
  created() {},
  mounted() {
    this.testEsArray();
  }
};
</script>
