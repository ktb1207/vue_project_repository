<template>
  <ul class="k-classify-menus" :class="[customClass]">
    <li
      v-for="item in menusList"
      :key="item.prop"
      :class="{ 'select-li': item.prop === selectItemProp }"
      @click="itemClick(item.routeName, item.prop)"
    >
      {{ item.label }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef } from 'vue';

export type MenuItemType = {
  // 路由名称
  routeName: string;
  // 文字
  label: string;
  // 标识
  prop?: string;
};

interface Props {
  menusArr: Array<MenuItemType>;
  activeProp: string;
  // 样式标识
  styleType?: 'normal' | 'index';
}

export default defineComponent({
  name: 'KClassifyMenus',
  emits: ['menuClick'],
  props: {
    menusArr: {
      type: Array as PropType<Array<MenuItemType>>,
      default: () => [],
      required: true
    },
    activeProp: {
      type: String,
      default: '',
      required: true
    },
    styleType: {
      type: String as PropType<'normal' | 'index'>,
      default: 'normal',
      required: false
    }
  },
  setup(props: Props, { emit }) {
    const menusList = toRef(props, 'menusArr');
    const selectItemProp = toRef(props, 'activeProp');
    const customClass = toRef(props, 'styleType');
    // li点击
    const itemClick = (routeNameStr: string, paramStr: string): void => {
      emit('menuClick', routeNameStr, paramStr);
    };
    return {
      menusList,
      selectItemProp,
      itemClick,
      customClass
    };
  }
});
</script>

<style lang="scss" scoped>
$yellowBtnBgColor: #fd910c;
$redBtnColor: #b81a19;
.k-classify-menus.normal {
  margin: 0;
  padding: 0;
  list-style: none;
  @mixin active-li {
    background-color: $yellowBtnBgColor;
    color: #fff;
  }
  li {
    float: left;
    height: 30px;
    line-height: 30px;
    color: #333;
    font-size: 14px;
    padding: 0 24px;
    border-right: 1px solid #d6d6d6;
    cursor: pointer;
    &:hover {
      @include active-li;
    }
  }
  .select-li {
    @include active-li;
  }
}
.k-classify-menus.index {
  margin: 0;
  padding: 0;
  list-style: none;
  @mixin active-li {
    background-color: $redBtnColor;
    color: #fff;
  }
  li {
    float: left;
    height: 24px;
    line-height: 24px;
    color: #e60505;
    font-size: 14px;
    padding: 0 6px;
    margin: 0 14px;
    cursor: pointer;
    &:hover {
      @include active-li;
    }
  }
  .select-li {
    @include active-li;
  }
}
</style>
