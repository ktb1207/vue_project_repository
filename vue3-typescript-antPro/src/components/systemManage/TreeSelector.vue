<template>
  <ElSelect v-model="valueLabel" ref="select" :clearable="clearable" @clear="handleClear" :placeholder="placeholder">
    <ElOption :value="valueLabel">
      <ElTree
        id="tree-option"
        ref="selectTree"
        :data="treeOptions"
        :props="treeProps"
        :node-key="treeProps.key"
        :default-expanded-keys="defaultExpandedKey"
        @node-click="handleNodeClick"
      >
      </ElTree>
    </ElOption>
  </ElSelect>
</template>
<script>
import { defineComponent } from 'vue';
import { ElSelect, ElOption, ElTree } from 'element-plus';

export default defineComponent({
  name: 'TreeSelector',
  components: {
    ElSelect,
    ElOption,
    ElTree
  },
  props: {
    modelValue: {
      type: Number,
      default: () => {
        return null;
      }
    },
    treeProps: {
      type: Object,
      default: () => {
        return {
          key: 'id',
          label: 'label',
          children: 'children'
        };
      }
    },
    treeOptions: {
      type: Array,
      default: () => {
        return [];
      }
    },
    clearable: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    placeholder: {
      type: String,
      default: () => {
        return '请选择';
      }
    }
  },
  data() {
    return {
      valueId: this.modelValue,
      valueLabel: '',
      defaultExpandedKey: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.valueId) {
        this.valueLabel = this.$refs.selectTree.getNode(this.valueId).data[this.treeProps.label];
        this.$refs.selectTree.setCurrentKey(this.valueId);
        this.defaultExpandedKey = [this.valueId];
      }
      this.$nextTick(() => {
        const scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0];
        const scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar');
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;';
        scrollBar.forEach((ele) => (ele.style.width = 0));
      });
    },
    handleNodeClick(node) {
      this.valueLabel = node[this.treeProps.label];
      this.valueId = node[this.treeProps.key];
      this.$emit('update:modelValue', this.valueId);
      this.defaultExpandedKey = [];
      this.$refs.select.blur();
    },
    handleClear() {
      this.valueLabel = '';
      this.valueId = null;
      this.defaultExpandedKey = [];
      this.clearSelected();
      this.$emit('update:modelValue', null);
    },
    clearSelected() {
      const allNode = document.querySelectorAll('#tree-option .el-tree-node');
      allNode.forEach((element) => element.classList.remove('is-current'));
    }
  },
  watch: {
    modelValue() {
      this.valueId = this.modelValue;
      this.init();
    }
  }
});
</script>
<style lang="scss">
@import '@/components/systemManage/styles/index.scss';
</style>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 275px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #d30102;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
</style>
