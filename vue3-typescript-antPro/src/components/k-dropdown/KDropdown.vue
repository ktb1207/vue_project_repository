<template>
  <template v-if="listArr.length > 0">
    <ElDropdown trigger="click" placement="bottom-start" class="k-dropdown">
      <div class="user-placeholder">
        <i class="iconfont" :class="[iconStr]"></i>
        <span>{{ titleStr }}</span>
      </div>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem>item1</ElDropdownItem>
          <ElDropdownItem>item2</ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </template>
  <template v-else>
    <div class="unique-item user-placeholder" @click="uniqueClick">
      <i class="iconfont" :class="[iconStr]"></i>
      <span>{{ titleStr }}</span>
    </div>
  </template>
</template>

<script lang="ts">
import { dropItem } from './type';
interface Props {
  title: string;
  iconName: string;
  dropArr?: Array<dropItem>;
}
import { defineComponent, PropType, toRef } from 'vue';
export default defineComponent({
  name: 'KDropdown',
  emits: ['rootNodeClick'],
  props: {
    title: {
      type: String,
      required: true,
      default: '标题'
    },
    iconName: {
      type: String,
      required: true,
      default: 'icon-user'
    },
    dropArr: {
      type: Array as PropType<Array<dropItem>>,
      required: false,
      default: () => []
    }
  },
  setup(props: Props, { emit }) {
    const titleStr = toRef(props, 'title');
    const iconStr = toRef(props, 'iconName');
    const listArr = toRef(props, 'dropArr');

    // 单独唯一节点点击
    const uniqueClick = (): void => {
      emit('rootNodeClick');
    };
    return {
      titleStr,
      iconStr,
      listArr,
      uniqueClick
    };
  }
});
</script>

<style lang="scss" scoped>
.k-dropdown {
  .user-placeholder {
    color: #fff;
    font-size: 14px;
    cursor: pointer;
  }
}
.unique-item.user-placeholder {
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
</style>
