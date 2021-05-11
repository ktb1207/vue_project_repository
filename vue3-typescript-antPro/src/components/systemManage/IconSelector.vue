<template>
  <div>
    <ElInput v-model="iconName" readonly>
      <template #prefix>
        <span :class="`icon iconfont icon-${iconClass}`"></span>
      </template>
      <template #suffix>
        <ElButton icon="el-icon-thumb" type="text" @click="openDialog()"> 选择图标 </ElButton>
      </template>
    </ElInput>
    <div class="icon-dialog">
      <ElDialog v-model="visible" :destroy-on-close="true" append-to-body width="40%">
        <template #title>
          <div class="dialogHeader" />
          <span class="dialogTitle">选择图标</span>
          <ElDivider direction="vertical"></ElDivider>
          <ElInput
            v-model="filter"
            @input="handleFilter"
            :style="{ width: '260px' }"
            placeholder="搜索图标名称或类名"
            clearable
            @clear="resetList()"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-search"></i>
            </template>
          </ElInput>
          <ElDivider />
        </template>
        <div style="height:500px">
          <ElScrollbar style="height:100%">
            <ul class="icon-ul">
              <li
                v-for="item in iconList"
                :key="item.id"
                :class="current === item.class ? 'active-item' : ''"
                @click="handleSelect(item.class)"
              >
                <span :class="`icon iconfont icon-${item.class}`" style="font-size: 26px"></span>
                <div class="name">{{ item.name }}</div>
              </li>
            </ul>
          </ElScrollbar>
        </div>
        <template v-slot:footer>
          <ElButton type="danger" @click="handleFinish">确定</ElButton>
          <ElButton type="info" @click="handleCancel">取消</ElButton>
        </template>
      </ElDialog>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import iconsList from '@/assets/iconfont/iconfont.json';
import { defineComponent, ref, watch } from 'vue';
import { ElInput, ElButton, ElDialog, ElDivider, ElScrollbar } from 'element-plus';
type IconsListType = {
  icon_id: string;
  name: string;
  font_class: string;
  unicode: string;
  unicode_decimal: number;
};
type IconListType = {
  id: string;
  name: string;
  class: string;
  code: string;
};
export default defineComponent({
  name: 'IconDialog',
  components: {
    ElInput,
    ElButton,
    ElDialog,
    ElDivider,
    ElScrollbar
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const iconClass = ref(''); // 已选图标预览
    const iconName = ref(''); // 已选图标名称
    const current = ref(''); // 当前图标class
    const visible = ref(false); // 图标选择框visible
    // 打开图标选择弹框
    const openDialog = () => {
      current.value = props.modelValue;
      visible.value = true;
    };
    // 图标列表
    const originList = iconsList.glyphs.map((item: IconsListType) => {
      return {
        id: item.icon_id,
        name: item.name,
        class: item.font_class,
        code: item.unicode
      };
    });
    // 初始化图标列表
    const iconList = ref<Array<IconListType>>(originList);
    // 图标筛选
    const filter = ref('');
    const resetList = () => {
      filter.value = '';
      iconList.value = originList;
    };
    const handleFilter = (val: string) => {
      if (val) {
        iconList.value = iconList.value.filter((item: IconListType) => {
          return item.name.indexOf(val) > -1 || item.class.indexOf(val) > -1;
        });
      } else {
        resetList();
      }
    };
    // 图标选择
    const handleSelect = (icon: string) => {
      current.value = icon;
    };
    // 根据传入的class获取图标名
    const getIconName = (val: string) => {
      const temp = originList.filter((item: IconListType) => item.class === val);
      if (temp.length) {
        return temp[0].name;
      } else {
        return '';
      }
    };
    // 点击确定-关闭弹框
    const handleFinish = () => {
      iconClass.value = current.value;
      iconName.value = getIconName(current.value);
      emit('update:modelValue', current.value);
      visible.value = false;
      resetList();
    };
    const handleCancel = () => {
      visible.value = false;
      resetList();
    };
    // watch--根据传入的class回显图标
    watch(
      () => props.modelValue,
      () => {
        const val = props.modelValue;
        if (val) {
          iconClass.value = val;
          iconName.value = getIconName(val);
          current.value = val;
        }
      },
      { immediate: true }
    );
    return {
      iconClass,
      iconName,
      current,
      visible,
      openDialog,
      originList,
      iconList,
      resetList,
      filter,
      handleFilter,
      handleSelect,
      handleFinish,
      handleCancel
    };
  }
});
</script>
<style lang="scss" scoped>
.icon-ul {
  margin: 0;
  padding: 0;
  font-size: 0;
  li {
    list-style-type: none;
    text-align: center;
    font-size: 14px;
    display: inline-block;
    width: 16.66%;
    box-sizing: border-box;
    height: 108px;
    padding: 15px 6px 6px 6px;
    cursor: pointer;
    overflow: hidden;
    &:hover {
      background: #f5f7fa;
    }
    &.active-item {
      background: #ffd9d9;
      color: #d30102;
    }
    > i {
      font-size: 30px;
      line-height: 50px;
    }
  }
}
// .icon-dialog {
//   ::v-deep .el-dialog {
//     border-radius: 8px;
//     margin-bottom: 0;
//     margin-top: 4vh !important;
//     display: flex;
//     flex-direction: column;
//     max-height: 92vh;
//     overflow: hidden;
//     box-sizing: border-box;
//     .el-dialog__header {
//       padding-top: 14px;
//     }
//     .el-dialog__body {
//       margin: 0 20px 20px 20px;
//       padding: 0;
//       overflow: auto;
//     }
//   }
// }
</style>
