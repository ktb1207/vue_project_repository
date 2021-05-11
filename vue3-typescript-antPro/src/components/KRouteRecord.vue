<template>
  <ul class="k-route-record">
    <li
      v-for="item in recordData"
      :key="item.routeName"
      @click="wrapClick(item)"
      :class="{ active: item.routeName === activeItem }"
    >
      <span>{{ item.labelName }}</span>
      <i class="iconfont icon-guanbi" @click.stop="iconClick(item)"></i>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef } from 'vue';
import { RouteRecordItemType } from '@/store/index';
interface Props {
  listArr?: Array<RouteRecordItemType>;
  activeRecord?: string;
}
export default defineComponent({
  name: 'KRouteRecord',
  emits: ['delClick', 'itemClick'],
  props: {
    listArr: {
      type: Array as PropType<Array<RouteRecordItemType>>,
      default: () => []
    },
    activeRecord: {
      type: String,
      default: ''
    }
  },
  setup(props: Props, { emit }) {
    const recordData = toRef(props, 'listArr');
    const activeItem = toRef(props, 'activeRecord');
    // 删除
    const iconClick = (item: RouteRecordItemType): void => {
      emit('delClick', item);
    };
    // 选择
    const wrapClick = (item: RouteRecordItemType): void => {
      emit('itemClick', item);
    };
    return {
      recordData,
      iconClick,
      wrapClick,
      activeItem
    };
  }
});
</script>

<style lang="scss">
.k-route-record {
  display: flex;
  @mixin active-li {
    background-color: #d30102;
    color: #fff;
  }
  li {
    background-color: #fafafa;
    font-size: 14px;
    color: #000;
    padding: 4px 10px;
    margin-right: 4px;
    cursor: pointer;
    &:hover {
      @include active-li;
      .iconfont {
        color: #fff;
      }
    }
    .iconfont {
      margin-left: 8px;
      color: #c2c2c2;
      cursor: pointer;
    }
  }
  .active {
    @include active-li;
    .iconfont {
      color: #fff;
    }
  }
}
</style>
