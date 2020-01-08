
<style lang="less" scoped>
@active-tr: #ebf7ff;
.tree-content {
  .tree-click-node {
    cursor: pointer;
  }
  .tree-node-img {
    width: 18px;
    height: 18px;
    margin-right: 6px;
  }
  .tree-name-select {
    font-weight: normal;
    font-size: 14px;
  }
  .active-row {
    background-color: @active-tr;
  }
}
</style>

<template>
  <div class="tree-content" v-show="ctrlNodeShow">
    <div
      class="define-body-row"
      :class="{'active-row':contentObj.selected,'tree-click-node':rowClick}"
      @click="switchNode(contentObj,$event)"
    >
      <div
        class="define-cell text-more"
        v-for="(col,index) in contentCol"
        :key="index+'s'"
        :style="{width:col.width,textAlign:col.align,flexGrow:col.grow,flexShrink:col.shrink}"
        :data-type="col.key"
        :data-value="contentObj[col.key]||''"
      >
        <span
          v-if="col.type=='selection'"
          :data-type="col.key"
          :data-value="contentObj[col.key]||''"
          @click.stop
        >
          <box-img
            :prop-value="contentObj"
            :checked-status="contentObj.checked"
            :ban-status="contentObj.banCheck"
            :disabled="contentObj.disabled"
            @checkChange="checkboxClick"
          ></box-img>
        </span>
        <span
          v-else-if="col.type=='node'"
          :style="{paddingLeft:nodePadding,color:'#3b3b3b'}"
          :data-type="col.key"
          :data-value="contentObj[col.key]||''"
          class="node-row-span"
        >
          <span
            class="tree-click-node"
            v-if="contentChildren.length>0"
            @click.stop="hideNodeShow(nodeStatusType)"
          >
            <img :src="nodeImg" alt="node" class="tree-node-img" />
          </span>
          <!-- 可编辑 -->
          <span
            v-if="col.edit"
            class="input-wrp-span"
            :class="{'tree-name-select':contentObj.selected,'tree-click-node':rowClick}"
            :data-type="col.key"
            :data-value="contentObj[col.key]||''"
            :title="contentObj[col.key]"
          >
            <input
              class="table-input"
              type="text"
              :value="contentObj[col.key]"
              @blur="editTableCell($event,contentObj[col.key],col.key,contentObj)"
            />
          </span>
          <!-- 不可编辑 -->
          <span
            v-else
            :class="{'tree-name-select':contentObj.selected,'tree-click-node':rowClick}"
            :data-type="col.key"
            :data-value="contentObj[col.key]||''"
            :title="contentObj[col.key]"
          >
            <span v-if="col.formater" v-html="col.formater(contentObj)"></span>
            <span v-else>{{contentObj[col.key]}}</span>
          </span>
        </span>
        <div v-else class="text-div" :data-type="col.key" :data-value="contentObj[col.key]||''">
          <!-- 可编辑 -->
          <input
            v-if="col.edit"
            class="table-input"
            type="text"
            :value="contentObj[col.key]"
            :style="{textAlign:col.align}"
            @blur="editTableCell($event,contentObj[col.key],col.key,contentObj)"
          />
          <!-- 不可编辑 -->
          <div v-else class="text-no-edit-wrp">
            <div v-if="col.formater" v-html="col.formater(contentObj)"></div>
            <span v-else :title="contentObj[col.key]">{{contentObj[col.key]}}</span>
          </div>
        </div>
      </div>
    </div>
    <template v-if="ctrlNextNodeShow">
      <tree-content
        v-for="item in contentChildren"
        :key="item.id+'k'"
        :content-obj="item"
        :content-col="contentCol"
        :dom-index="saveDomInxPop"
        :show-node="saveShowNode"
        :row-click="rowClick"
        @nodeClick="selectNodeName"
        @preNodeSwitch="preNodeShowHide"
        @childUpdated="backChildUpdate"
        @checkItem="checkDataChange"
        @cellBlur="editTableCellBlur"
        @childChange="backChildChange"
      ></tree-content>
    </template>
  </div>
</template>

<script>
import closeImg from './tree_close.png';
import openImg from './tree_open.png';
import BoxImg from './BoxImg.vue';
export default {
  name: 'TreeContent',
  props: {
    contentCol: {
      // 列项
      type: Array,
      default() {
        return [];
      }
    },
    contentObj: {
      // 行项
      type: Object,
      default() {
        return {};
      }
    },
    domIndex: {
      // 记录当前递归次数
      type: Number,
      default: 1
    },
    showNode: {
      // 展开节点层级
      type: Number,
      default: 0 // 0展开所有
    },
    rowClick: {
      // 是否允许点击节点名称
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      isShowNode: true, // 是否显示节点
      saveDomInxPop: this.domIndex + 1,
      saveDomIndex: this.domIndex,
      saveShowNode: this.showNode
    };
  },
  computed: {
    nodeImg() {
      // 计算打开or关闭图片
      if (this.saveShowNode === 0) {
        return openImg;
      }
      return this.saveShowNode > this.saveDomIndex ? openImg : closeImg; // 显示数量大于tree层级节点即为显示子节点状态
    },
    nodePadding() {
      // 计算层级节点缩进
      if (this.domIndex === 1) {
        return '0';
      }
      const num = this.domIndex * (10 + this.domIndex + this.domIndex);
      return num + 'px';
    },
    ctrlNodeShow() {
      // 节点显示or隐藏
      if (this.showNode === 0) {
        return true;
      }
      return !(this.saveDomIndex > this.saveShowNode);
    },
    ctrlNextNodeShow() {
      // 当前节点的子节点显示或隐藏
      if (this.showNode === 0) {
        return true;
      }
      return !(this.saveDomInxPop > this.saveShowNode);
    },
    nodeStatusType: {
      // 当前节点打开or关闭
      get() {
        if (this.saveShowNode === 0) {
          // 显示全部状态，为0不能参与运算比较bug
          return true;
        }
        return this.saveShowNode > this.saveDomIndex; // 显示数量大于tree层级节点即为显示子节点状态
      },
      set(newVal) {
        if (newVal) {
          // 关闭--打开
          this.saveShowNode = this.saveDomIndex + 1;
        } else {
          // 打开--关闭
          this.saveShowNode = this.saveDomIndex;
        }
      }
    },
    contentChildren() {
      return this.contentObj.children || [];
    }
  },
  components: {
    BoxImg
  },
  watch: {
    domIndex(newVal, oldVal) {
      // 监听重新保存
      this.saveDomIndex = newVal;
    },
    showNode(newVal, oldVal) {
      // 监听重新保存
      this.saveShowNode = newVal;
    }
  },
  methods: {
    // 节点展开收起
    hideNodeShow(status) {
      this.nodeStatusType = !status;
      this.$emit('preNodeSwitch');
    },
    switchNode(obj, event) {
      // 单击节点名称，反馈父级
      // 允许切换行并且当前行状态没有选中情况下
      console.log(obj.name);
      if (this.rowClick) {
        if (
          event.target.attributes['data-type'] &&
          event.target.attributes['data-value']
        ) {
          this.$emit(
            'nodeClick',
            obj,
            event.target.attributes['data-type'].nodeValue,
            event.target.attributes['data-value'].nodeValue
          );
        } else {
          this.$emit('nodeClick', obj, null, null);
        }
      }
    },
    selectNodeName(obj, colKey, rowValue) {
      // 反馈父级
      this.$emit('nodeClick', obj, colKey, rowValue);
    },
    // 单个节点展开or收起反馈事件
    preNodeShowHide() {
      this.$emit('preNodeSwitch');
    },
    // 反饋父組件子組件更新
    backChildUpdate() {
      this.$emit('childUpdated');
    },
    // 反馈父组件子组件更新
    backChildChange(updateItem) {
      this.$emit('childChange', updateItem);
    },
    // 单个复选框勾选事件
    checkboxClick(obj) {
      this.$emit('checkItem', obj);
    },
    // 子组件更新
    checkDataChange(obj) {
      this.$emit('checkItem', obj);
    },
    // 编辑框失去焦点
    editTableCell(event, oldVal, colKey, oldObj) {
      this.$emit('cellBlur', event, oldVal, colKey, oldObj);
    },
    editTableCellBlur(event, oldVal, colKey, oldObj) {
      this.$emit('cellBlur', event, oldVal, colKey, oldObj);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit('childUpdated');
      // 节点属性添加层级字段
      this.contentObj.level = this.domIndex;
    });
  },
  updated() {
    this.$nextTick(() => {
      this.$emit('childUpdated');
      this.$emit('childChange', this.contentObj);
    });
  }
};
</script>
