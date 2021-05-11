<template>
  <div class="k-nav-menu" :style="{ width: collapseState ? 'auto' : '220px' }">
    <ElMenu
      background-color="#f8f8f8"
      text-color="#000"
      active-text-color="#fff"
      :unique-opened="true"
      :collapse="collapseState"
      :default-active="activeItemIndex"
      @select="selectMenuItem"
    >
      <KNavItem v-for="item in navArr" :key="item.index + 'rt'" :nav-item="item"></KNavItem>
    </ElMenu>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef } from 'vue';
import { ElMenu } from 'element-plus';
import KNavItem from './KNavItem';
import { NavMenuType } from './type';
interface Props {
  // 菜单项数据
  navMenus: Array<NavMenuType>;
  // 当前激活项
  activeRouteName: string;
  // 展开/收起状态
  collapseStatus: boolean;
}

export default defineComponent({
  name: 'KNavMenu',
  emits: ['itemClick'],
  props: {
    navMenus: {
      type: Array as PropType<Array<NavMenuType>>,
      default: () => [],
      required: true
    },
    activeRouteName: {
      type: String,
      default: ''
    },
    collapseStatus: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ElMenu,
    KNavItem
  },
  setup(props: Props, { emit }) {
    const navArr = toRef(props, 'navMenus');
    const activeItemIndex = toRef(props, 'activeRouteName');
    const collapseState = toRef(props, 'collapseStatus');
    //菜单激活
    const selectMenuItem = (routeName: string): void => {
      emit('itemClick', routeName);
    };
    return {
      navArr,
      activeItemIndex,
      selectMenuItem,
      collapseState
    };
  }
});
</script>

<style lang="scss">
.k-nav-menu {
  height: 100%;
  overflow-y: auto;
  width: 220px;
  background-color: #f8f8f8;
  .el-menu {
    .el-submenu {
      border-bottom: 1px solid #e7e8f2;
      &.is-active {
        background-color: #ffb9b5;
        .el-submenu__title {
          background-color: #ffb9b5 !important;
          border-left: 4px solid #c80000;
          .subtext {
            color: #c80000;
          }
          .subicon {
            color: #c80000;
          }
          .el-submenu__icon-arrow {
            color: #c80000;
          }
        }
        .el-menu-item.is-active {
          background-color: #d30102 !important;
          color: #fff !important;
        }
      }
      .el-submenu__title {
        &:hover {
          background-color: #ffb9b5 !important;
          .subtext {
            color: #c80000;
          }
          .subicon {
            color: #c80000;
          }
          .el-submenu__icon-arrow {
            color: #c80000;
          }
        }
      }
      .el-menu-item {
        &:hover {
          background-color: #ffb9b5 !important;
          color: #c80000 !important;
        }
      }
    }
  }
  .subicon {
    font-size: 24px;
    margin-right: 12px;
    color: #000;
  }
}
// 折叠样式
.el-popper {
  .el-menu-item {
    &:hover {
      background-color: #ffb9b5 !important;
      color: #c80000 !important;
    }
  }
  .el-menu-item.is-active {
    background-color: #d30102 !important;
    color: #fff !important;
  }
}
</style>
