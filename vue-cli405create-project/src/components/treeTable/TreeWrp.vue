<!--
  Attributes:
    :columns-表格列 array
    {
      type: selection 选择框,node 节点树,text 普通文本
      title: 表格列标题,
      key: 表格列数据对应键标识,
      width: 列宽
      align: 单元格对齐方式,
      grow: 单元格flex布局是否伸展剩余空间,
      edit:Boolean,列是否可编辑
      formater:(item) =>{ 格式化单元格内容
        return item.addTypeText
      }
    }
    :tree-data 表格tree平行数据
    {
      源数据：
      id:数据id
      pid:数据父id
      修改增加字段：
      selected:选中当前行
      disabled:禁止勾选行
      checked:勾选当前行
      banCheck:关联勾选
    }
    :spread-num 表格默认展开层级,0-展开全部，1-1,2-2,3-3,4-4...999-节点展开保持当前状态不变
    parent-id-name 配置指定tree根节点名称
    :row-click 是否允许点击切换行
    :exist-data 是否有无数据
    unique-ref 唯一ref
    checkIsConcatBan:getTreeAllCheck方法是否包含半勾选数据
    :relation-check:是否关联勾选
    :custom-tree-class 自定义树样式名称
  Events:
    @checkRow 复选框勾选事件 回调参数：[id,id],仅返回勾选目标节点，不包含关联勾选项，如果想获取所有勾选项请访问getTreeAllCheck
    @clickRow 节点行项点击选择 回调参数：tree-data项obj，每一列的key项columns.key
    @editCellBlur 编辑框修改事件
-->

<style lang="less">
@basic-font: #383838;
@color-font: #383838;
@border-color: #c3e0f5;
@head-bg: #d7ebf9;
.tree-wrp {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  div {
    box-sizing: border-box;
  }
  .el-checkbox-group {
    height: 100%;
    width: 100%;
  }
  .define-table {
    width: 100%;
    height: 100%;
    font-size: 14px;
    .define-body {
      width: 100%;
      height: 100%;
      display: inline-block;
      overflow-y: hidden;
      overflow-x: hidden;
      color: @basic-font;
      .define-header-row {
        top: 0;
        left: 0;
        z-index: 4;
        width: 100%;
        white-space: nowrap;
        line-height: 42px;
        font-weight: normal;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        background-color: @head-bg;
        .define-cell:last-child {
          border-right: none;
        }
      }
      .define-body-content {
        height: calc(100% - 42px);
        width: 100%;
        overflow-y: auto;
        .bottom-content {
          border-bottom: 1px solid @border-color;
        }
      }
      .define-header-bottom-border {
        border-bottom: 1px solid @border-color;
      }
      .define-body-row {
        white-space: nowrap;
        line-height: 38px;
        font-weight: normal;
        color: @color-font;
        border-top: 1px solid @border-color;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        .define-cell:last-child {
          border-right: none;
        }
        .text-more {
          overflow-x: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .define-cell {
      display: inline-block;
      padding: 0 8px;
      vertical-align: middle;
      box-sizing: border-box;
      border-right: 1px solid @border-color;
      text-align: center;
      margin: 0;
      flex: 0 0 auto;

      .node-row-span {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .input-wrp-span {
          display: inline-block;
          width: 100%;
          .table-input {
            display: inline-block;
            box-sizing: border-box;
            width: 100%;
            height: 28px;
            border: none;
            background-color: #ffffff;
            &:focus {
              border: none;
              outline: none;
              background-color: #ffffff;
            }
          }
        }
      }
      .text-div {
        height: 100%;
        overflow: hidden;
        .table-input {
          display: inline-block;
          box-sizing: border-box;
          width: 100%;
          height: 28px;
          border: none;
          background-color: #ffffff;
          &:focus {
            border: none;
            outline: none;
            background-color: #ffffff;
          }
        }
        .text-no-edit-wrp {
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .tree-content .define-cell .el-checkbox {
    .el-checkbox__input.is-disabled .el-checkbox__inner {
      background-color: #dddddd;
      border-color: #dddddd;
    }
  }
}
.tree-table {
  min-width: 100%;
  table-layout: fixed;
  word-wrap: break-word;
  word-break: break-all;
  thead {
    font-size: 14px;
    color: @basic-font;
    font-weight: 700;
    tr {
      line-height: 40px;
    }
  }
  tbody {
    font-size: 14px;
    color: @color-font;
    background-color: #ffffff;
    tr {
      line-height: 36px;
    }
  }
  td {
    padding: 0 8px;
    border: 1px solid #e7e7e7;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #ffffff !important;
    &::after {
      border-color: #0190fe;
    }
  }
}
</style>
<template>
  <div class="tree-wrp"
    :class="customTreeClass">
    <div class="define-table">
      <div class="define-body">
        <div class="define-header-row"
          :class="{'define-header-bottom-border':!existData}"
          :style="{'padding-right':scrollWidthPx}">
          <div class="define-cell"
            v-for="(item,index) in columns"
            :key="index+'c'"
            :style="{width:item.width,textAlign:item.align,flexGrow:item.grow}">
            <span v-if="item.type=='selection'">
              <check-all :checked-status="allCheckStatus"
                :disabled="!existData"
                @allCheck="checkAllMethod"></check-all>
            </span>
            <span v-else>
              {{item.title}}
            </span>
          </div>
        </div>
        <div v-if="existData"
          class="define-body-content"
          :ref="this.uniqueRef">
          <div class="bottom-content">
            <tree-content v-for="item in formaterTreeData"
              :key="item.id+'c'"
              :content-obj="item"
              :content-col="columns"
              :dom-index="1"
              :show-node="saveSpreadNum"
              :row-click="rowClick"
              @nodeClick="selectNodeName"
              @preNodeSwitch="preNodeShowHide"
              @childUpdated="childUpdateMethods"
              @checkItem="checkDataChange"
              @cellBlur="tableCellBlur"
              @childChange="childChangeMethod"></tree-content>
          </div>
        </div>
        <no-data v-else></no-data>
      </div>
    </div>
  </div>
</template>

<script>
import TreeContent from './TreeContent.vue';
import NoData from './NoData.vue';
import CheckAll from './CheckAll.vue';
export default {
  name: 'TreeWrp',
  props: {
    columns: {
      // 列项
      type: Array,
      default() {
        return [];
      }
    },
    treeData: {
      // tree数据
      type: Array,
      default() {
        return [];
      }
    },
    spreadNum: {
      // 展开第几项，0即展开所有
      type: Number,
      default: 0
    },
    parentIdName: {
      // tree根节点名称
      type: String,
      default: 'parentId'
    },
    rowClick: {
      // 是否允许点击节点名称
      type: Boolean,
      default() {
        return false;
      }
    },
    existData: {
      type: Boolean,
      default: false
    },
    uniqueRef: {
      type: String,
      default: 'unique-ref'
    },
    checkIsConcatBan: {
      type: Boolean,
      default: false
    },
    relationCheck: {
      type: Boolean,
      default: false
    },
    customTreeClass: {
      type: String,
      default: 'custom-class-name'
    }
  },
  data() {
    return {
      checkList: [], // 勾选值
      saveTreeData: this.treeData, // 保存原始数据
      saveSpreadNum: this.spreadNum, // 保存展开项控制
      saveTreeSelectedRow: false, // 保存记录源数据是否包含选中行
      scrollWidth: 0, // 滾動條寬度
      runStatus: true,
      treeNoDisabledLength: 0, // 树可勾选数据长度
      allCheckStatus: 'empty' // all empty concat
    };
  },
  computed: {
    formaterTreeData() {
      return this.parseList(this.saveTreeData);
    },
    scrollWidthPx() {
      return this.scrollWidth + 'px';
    }
  },
  components: {
    TreeContent,
    NoData,
    CheckAll
  },
  watch: {
    treeData(newVal, oldVal) {
      // 监听父tree数据改变重新保存
      this.saveTreeData = newVal;
      console.log('数据更新了...');
    },
    spreadNum(newVal, oldVal) {
      // 监听切换展开层级
      if (newVal === 999) {
        // 当前展开状态不变
        this.saveSpreadNum = oldVal;
        return;
      }
      if (newVal === this.saveSpreadNum) {
        // 两次展开数据一样，强制刷新节点
        if (newVal > 1) {
          this.saveSpreadNum = this.saveSpreadNum - 1;
        } else {
          this.saveSpreadNum = this.saveSpreadNum + 1;
        }
        setTimeout(() => {
          this.saveSpreadNum = newVal;
        }, 100);
      } else {
        this.saveSpreadNum = newVal;
      }
      this.addSelect(); // 初始化tree
    },
    checkList(newVal, oldVal) {
      this.$emit('checkRow', newVal);
      if (newVal.length > 0) {
        if (newVal.length === this.treeNoDisabledLength) {
          this.allCheckStatus = 'all';
        } else {
          this.allCheckStatus = 'concat';
        }
      } else {
        this.allCheckStatus = 'empty';
      }
    },
    saveTreeData(newVal, oldVal) {
      if (newVal.length > 0) {
        this.addSelect();
      }
    },
    // 无数据清空勾选、清空选中行
    existData(newVal, oldVal) {
      if (!newVal) {
        this.checkList = [];
      }
    },
    // 无tree数据渲染
    formaterTreeData(newVal, oldVal) {
      if (newVal.length === 0) {
        this.$emit('clickRow', null, 'undefind', 'undefined', 'notree');
      }
      // 关联勾选
      if (newVal.length > 0 && this.relationCheck) {
        this.findTreeEvery(newVal);
      }
    }
  },
  methods: {
    // 对原始数据新增selected,禁止勾选状态属性
    addSelect() {
      this.treeNoDisabledLength = 0;
      this.saveTreeData.map((item, index) => {
        if (!item.selected) {
          // 如果源数据项存在选中状态则不改变，否则取消选中状态
          this.$set(item, 'selected', false);
        }
        if (!item.disabled) {
          // 如果源数据项存在禁止状态则不改变，否则取消禁止状态
          this.$set(item, 'disabled', false);
          this.treeNoDisabledLength++;
        }
        if (!item.checked) {
          // 如果源数据项存在勾选状态则不改变，否则取消选中
          this.$set(item, 'checked', false);
        } else {
          if (!this.checkList.includes(item.id)) {
            this.checkList.push(item.id);
          }
        }
        if (!item.banCheck) {
          // 如果源数据项存在半勾选状态则不改变，否则取消半选
          this.$set(item, 'banCheck', false);
        }
      });

      // 检测原始数据是否含有选择项
      this.saveTreeSelectedRow = this.saveTreeData.some((item, index) => {
        return item.selected === true;
      });
      /**
       * 修改selected
       * 如果源数据没有选中项则继续判断勾选框有没有选中数据
       * 如果有选中数据则默认选中勾选款保存对应第一个数据
       * 否则没有默认选择项
       */
      if (!this.saveTreeSelectedRow) {
        if (this.checkList.length > 0) {
          this.saveTreeData.forEach((item, index) => {
            if (item.id === this.checkList[0]) {
              this.$set(item, 'selected', true);
              this.$emit('clickRow', item, 'undefind', 'undefined', 'checkbox');
            }
          });
        }
      }
    },
    parseList(list) {
      // 创建一个对象命名为map
      const map = {};
      // 通过遍历把list中的元素放到map对象中
      list.forEach(item => {
        this.$set(item, 'children', []); // 出发vue更新
        if (!map[item.id]) {
          // 核心步骤1：map中的'item.id'属性指向list数组中的对象元素
          map[item.id] = item;
        }
      });
      // 再次遍历为了对map属性所指的对象进行处理
      list.forEach(item => {
        // 过滤父级id不是null的元素
        if (item[this.parentIdName] != null) {
          // map[item.pid]为该元素的父级元素
          if (map[item[this.parentIdName]]) {
            map[item[this.parentIdName]].children.push(item);
          }
        }
      });
      // 过滤后仅剩下根节点
      const filterArr = list.filter(item => {
        if (item[this.parentIdName] === null) {
          return item;
        }
      });

      // 首次加载默认选中第一个根节点行
      filterArr.forEach((ele, index) => {
        if (!this.saveTreeSelectedRow && index === 0) {
          this.$set(ele, 'selected', true);
          this.$emit('clickRow', ele, 'undefind', 'undefined', 'first');
        }
      });
      return filterArr;
    },
    selectNodeName(obj, colKey, RowValue) {
      // 根据点击修改选中项
      this.saveTreeSelectedRow = true; // 修改删除节点，点击其他子节点，跟节点同样选中
      this.saveTreeData.forEach((item, index) => {
        item.selected = obj.id === item.id;
      });
      this.$emit('clickRow', obj, colKey, RowValue, 'select');
    },
    // 单个节点展开or收起反馈事件
    preNodeShowHide() {
      this.$emit('preNodeSwitch');
    },

    /***
     * 子节点上下移动--提供父组件调用
     *  */

    nodeMove(deriction, pid, id) {
      if (pid != null) {
        const parentItem = findTreeList(this.formaterTreeData, pid); // 父节点
        const parentChildren = parentItem.children;
        const parentChildLeng = parentItem.children.length;
        let targetItemIndex = 0; // 当前移动节点在父节点中位置
        parentChildren.forEach((item, index) => {
          if (item.id === id) {
            targetItemIndex = index;
          }
        });
        if (deriction === 'up' && targetItemIndex === 0) {
          console.log('到顶了...');
        } else if (
          deriction === 'down' &&
          targetItemIndex === parentChildLeng - 1
        ) {
          console.log('到底了...');
        } else {
          this.executeNodeMove(deriction, pid, id);
        }
      } else {
        const rootNodeLeng = this.formaterTreeData.length;
        let targetItemIndex = 0;
        this.formaterTreeData.forEach((item, index) => {
          if (item.id === id) {
            targetItemIndex = index;
          }
        });
        if (deriction === 'up' && targetItemIndex === 0) {
          console.log('到顶了...');
        } else if (
          deriction === 'down' &&
          targetItemIndex === rootNodeLeng - 1
        ) {
          console.log('到底了...');
        } else {
          this.executeNodeMove(deriction, pid, id);
        }
      }
    },
    // 执行节点移动
    executeNodeMove(deriction, pid, id) {
      const someParentItemArr = [];
      const someParentIndexArr = [];
      this.saveTreeData.forEach((item, index) => {
        if (item.pid === pid) {
          someParentItemArr.push(item);
          someParentIndexArr.push(index);
        }
      });
      someParentItemArr.forEach((item, index) => {
        if (item.id === id) {
          const targetIndex = someParentIndexArr[index];
          const newIndex =
            deriction === 'up'
              ? someParentIndexArr[index - 1]
              : someParentIndexArr[index + 1];
          this.$set(this.saveTreeData, newIndex, item);
          if (deriction === 'up') {
            this.$set(
              this.saveTreeData,
              targetIndex,
              someParentItemArr[index - 1]
            );
          } else {
            this.$set(
              this.saveTreeData,
              targetIndex,
              someParentItemArr[index + 1]
            );
          }
        }
      });
    },
    childUpdateMethods() {
      /**
       * 函数节流
       */
      if (!this.runStatus) {
        return;
      }
      this.runStatus = false;
      setTimeout(() => {
        this.scrollWidth = this.computedScrollWidth();
        this.runStatus = true;
      }, 300);
    },
    // 计算滚动条宽度
    computedScrollWidth() {
      if (this.$refs[this.uniqueRef]) {
        const scrollbarWidth =
          this.$refs[this.uniqueRef].offsetWidth -
          this.$refs[this.uniqueRef].clientWidth;
        return scrollbarWidth;
      }
      return 0;
    },
    // 勾选数据项改变事件
    checkDataChange(itemObj) {
      // 节点本身
      itemObj.banCheck = false;
      this.$set(itemObj, 'checked', !itemObj.checked);
      if (itemObj.checked) {
        // 选中
        this.checkList.push(itemObj.id);
      } else {
        // 取消
        this.checkList.forEach((item, index) => {
          if (item === itemObj.id) {
            this.checkList.splice(index, 1);
          }
        });
      }
      // 是否关联勾选
      if (this.relationCheck) {
        // 下级节点和子节点
        this.deepDownConcat(itemObj.children, itemObj.checked);
        // 父节点和祖父节点
        this.deepUpConcat(itemObj, itemObj.checked);
      }
    },
    // 向下级联勾选
    deepDownConcat(arr, status) {
      for (let i = 0, ln = arr.length; i < ln; i++) {
        if (!arr[i].disabled) {
          arr[i].banCheck = false;
          // 节点当前状态和发生勾选状态不一致则修改
          if (arr[i].checked !== status) {
            this.$set(arr[i], 'checked', status);
          }
          // 取消删除目标点节点勾选
          if (!status && this.checkList.indexOf(arr[i].id) !== -1) {
            this.checkList.splice(this.checkList.indexOf(arr[i].id), 1);
          }
          // 勾选添加选择节点id
          if (status && this.checkList.indexOf(arr[i].id) === -1) {
            this.checkList.push(arr[i].id);
          }
          if (arr[i].children.length > 0) {
            this.deepDownConcat(arr[i].children, status);
          } else {
            continue;
          }
        }
      }
    },
    // 向上级联勾选
    deepUpConcat(obj, status) {
      if (obj[this.parentIdName]) {
        const parentItem = findTreeList(this.formaterTreeData, obj.pid); // 父节点
        // 父节点可操作
        if (!parentItem.disabled) {
          if (status) {
            const parentChildrenStatusArr = [];
            const parentChildrenBanArr = [];
            parentItem.children.forEach(item => {
              parentChildrenStatusArr.push(item.checked);
              parentChildrenBanArr.push(item.banCheck);
            });
            // 子节点存在不完全勾选或者存在办勾选则父节点半勾选
            if (
              parentChildrenStatusArr.includes(false) ||
              parentChildrenBanArr.includes(true)
            ) {
              this.$set(parentItem, 'banCheck', true);
              this.$set(parentItem, 'checked', false);
            } else {
              this.$set(parentItem, 'checked', true);
              this.$set(parentItem, 'banCheck', false);
              // 添加父级节点选择项id
              if (!this.checkList.includes(parentItem.id)) {
                this.checkList.push(parentItem.id);
              }
            }
          } else {
            const parentChildrenStatusArr = [];
            const parentChildrenBanArr = [];
            parentItem.children.forEach(item => {
              parentChildrenStatusArr.push(item.checked);
              parentChildrenBanArr.push(item.banCheck);
            });
            this.$set(parentItem, 'checked', false);
            // 取消删除目标点节点勾选
            if (this.checkList.indexOf(parentItem.id) !== -1) {
              this.checkList.splice(this.checkList.indexOf(parentItem.id), 1);
            }
            // 子节点有勾选项或者有半勾选项
            if (
              parentChildrenStatusArr.includes(true) ||
              parentChildrenBanArr.includes(true)
            ) {
              this.$set(parentItem, 'banCheck', true);
            } else {
              this.$set(parentItem, 'banCheck', false);
            }
          }
        }
        return this.deepUpConcat(parentItem, status);
      }
    },
    // 外部refs使用，获取树所有勾选节点
    getTreeAllCheck() {
      const arr = [];
      this.saveTreeData.forEach(item => {
        if (item.checked) {
          arr.push(item);
        }
        if (this.checkIsConcatBan && item.banCheck) {
          arr.push(item);
        }
      });
      return arr;
    },
    // 编辑框失去焦点
    tableCellBlur(event, oldVal, colKey, oldObj) {
      if (event.target.value === '') {
        event.target.value = oldVal;
        console.log('修改不能为空');
      } else {
        this.$emit('editCellBlur', event.target.value, oldObj, colKey);
      }
    },
    // 子组件更新
    childChangeMethod(childItem) {
      // 外部组件更改数据checked属性，删除勾选数组保存对应id
      if (this.checkList.length > 0) {
        if (!childItem.checked && this.checkList.includes(childItem.id)) {
          const newCheckArr = [];
          this.checkList.forEach((value, index) => {
            if (value !== childItem.id) {
              newCheckArr.push(value);
            }
          });
          this.checkList = newCheckArr;
        }
      }
    },
    // 选择所有
    checkAllMethod(str) {
      if (str === 'all') {
        this.saveTreeData.forEach(item => {
          if (!item.disabled) {
            if (!item.checked) {
              this.$set(item, 'checked', true);
              this.$set(item, 'banCheck', false);
              if (!this.checkList.includes(item.id)) {
                this.checkList.push(item.id);
              }
            }
          }
        });
      } else {
        this.saveTreeData.forEach(item => {
          if (!item.disabled) {
            if (item.checked) {
              this.$set(item, 'checked', false);
              this.$set(item, 'banCheck', false);
              for (let i = 0, l = this.checkList.length; i < l; i++) {
                if (item.id === this.checkList[i]) {
                  this.checkList.splice(i, 1);
                  break;
                }
              }
            }
          }
        });
      }
    },
    findTreeEvery(treeArr) {
      for (const i in treeArr) {
        if (treeArr[i].checked) {
          // 下级节点和子节点
          this.deepDownConcat(treeArr[i].children, true);
          // 父节点和祖父节点
          this.deepUpConcat(treeArr[i], true);
        }
        if (treeArr[i].children.length > 0) {
          this.findTreeEvery(treeArr[i].children);
        } else {
          continue;
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.addSelect();
    });
  },
  updated() {
    this.$nextTick(() => {
      // 清楚删除项勾选值
      if (this.treeData.length > 0) {
        const treeArrIds = [];
        this.treeData.forEach((item, index) => {
          treeArrIds.push(item.id);
        });
        const newCheckArr = [];
        this.checkList.forEach((item, index) => {
          if (treeArrIds.includes(item)) {
            newCheckArr.push(item);
          }
        });
        this.checkList = newCheckArr;
      }
    });
  },
  beforeDestroy() {
    this.checkList = []; // 清空复选项
  }
};
// 递归遍历树节点
function findTreeList(treeArr, id) {
  let findObj = null;
  loopTree(treeArr, id);
  function loopTree(treeArr, id) {
    for (let i = 0; i < treeArr.length; i++) {
      // 找到有值则跳出
      if (findObj) {
        break;
      }
      const obj = treeArr[i];
      if (!obj || !obj.id) {
        continue;
      }
      if (obj.id === id) {
        // 找到跳出
        // console.log('找到了');
        findObj = obj;
        break;
      } else {
        if (obj.children.length > 0) {
          // 下一层
          loopTree(obj.children, id);
        } else {
          // 返回上一级
          continue;
        }
      }
    }
  }
  return findObj;
}
</script>
