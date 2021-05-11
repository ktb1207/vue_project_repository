<template>
  <div
    class="k-feature-drag"
    draggable="true"
    @dragover="allowDrop($event)"
    @dragstart="dragStart($event, titleName)"
    @drop="dropEnd($event, titleName)"
  >
    <header class="header-title">
      <i class="iconfont icon-baobiaoguanli"></i>
      <span class="title-text">{{ titleName }}</span>
    </header>
    <div class="show-wrp" @dragover="allowItemDrop($event)" @drop="itemDropEnd($event, 'show', 'noId')">
      <div
        class="item"
        v-for="(item, index) in showArr"
        :key="index"
        draggable="true"
        @dragstart="itemDragStart($event, item.id)"
        @dragenter="addEmptyItem($event, 'show', index)"
        @dragleave="removeEmptyItem($event, 'show')"
        @drop.stop="itemDropEnd($event, 'show', itemId)"
      >
        <KFeaturePre :title="item.name" :iconfont-name="item.iconfontName" :readonly="true"></KFeaturePre>
      </div>
    </div>
    <div class="hide-wrp" @dragover="allowItemDrop($event)" @drop="itemDropEnd($event, 'hide', 'noId')">
      <div
        class="item"
        v-for="(item, index) in hideArr"
        :key="index"
        draggable="true"
        @dragstart="itemDragStart($event, item.id)"
        @dragenter="addEmptyItem($event, 'hide', index)"
        @dragleave="removeEmptyItem($event, 'hide')"
        @drop.stop="itemDropEnd($event, 'hide', item.id)"
      >
        <KFeaturePre
          :title="item.name"
          :iconfont-name="item.iconfontName"
          theme="no-active"
          :readonly="true"
        ></KFeaturePre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef, ref, watch } from 'vue';
import { KFeaturePre, FeatureItem } from '../k-feature-container/index';
import useWrapDrag from './useWrapDrag';
interface Props {
  title?: string;
  listArr?: Array<FeatureItem>;
}
export default defineComponent({
  name: 'KFeatureDrag',
  emits: ['wrpDragStart', 'wrpDragEnd', 'itemDropEnd'],
  props: {
    title: {
      type: String,
      required: false,
      default: '标题'
    },
    listArr: {
      type: Array as PropType<Array<FeatureItem>>,
      required: false,
      default: () => []
    }
  },
  components: {
    KFeaturePre
  },
  setup(props: Props, { emit }) {
    const titleName = toRef(props, 'title');
    const { allowDrop, dragStart, dropEnd } = useWrapDrag(emit);

    const originArr = toRef(props, 'listArr');
    const showArr = ref<Array<FeatureItem>>([]);
    const hideArr = ref<Array<FeatureItem>>([]);
    const itemIds: Array<string> = [];
    let dragItemId = '';
    let dropItemId = '';
    const emptyItem: FeatureItem = {
      id: '9999',
      name: '',
      iconfontName: 'xxxxx',
      isShow: true
    };
    originArr.value?.forEach((item) => {
      itemIds.push(item.id);
      item.isShow ? showArr.value.push(item) : hideArr.value.push(item);
    });
    /**
     * 观察原菜单项数据变化
     * 重新计算显示隐藏分组
     *
     */
    // watch(originArr, (newVal) => {
    //   console.log('数据有变化');
    //   showArr.value.splice(0, showArr.value.length);
    //   hideArr.value.splice(0, hideArr.value.length);
    //   newVal?.forEach((item) => {
    //     item.isShow ? showArr.value.push(item) : hideArr.value.push(item);
    //   });
    // });
    watch(props, (val) => {
      const newArr = val.listArr;
      showArr.value.splice(0, showArr.value.length);
      hideArr.value.splice(0, hideArr.value.length);
      newArr?.forEach((item) => {
        item.isShow ? showArr.value.push(item) : hideArr.value.push(item);
      });
    });
    // 菜单项-拖拽-开始
    const itemDragStart = (e: DragEvent, itemId: string) => {
      e.dataTransfer?.setData('itemdrag', 'itemdrag');
      dragItemId = itemId;
      e.stopPropagation();
    };
    // 允许放置
    const allowItemDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types && e.dataTransfer?.types[0] === 'itemdrag' && itemIds.includes(dragItemId)) {
        e.preventDefault();
      }
    };
    // 放置空占位
    const addEmptyItem = (e: DragEvent, area: string, inx: number) => {
      e.preventDefault();
      if (area === 'show') {
        dropItemId = showArr.value[inx].id;
        showArr.value.splice(inx, 0, emptyItem);
      }
      if (area === 'hide') {
        dropItemId = hideArr.value[inx].id;
        hideArr.value.splice(inx, 0, emptyItem);
      }
    };
    // 移除空占位
    const removeEmptyItem = (e: DragEvent, area: string) => {
      e.preventDefault();
      if (area === 'show') {
        showArr.value.forEach((val, index) => {
          if (val.id === '9999') {
            showArr.value.splice(index, 1);
          }
        });
      }
      if (area === 'hide') {
        hideArr.value.forEach((val, index) => {
          if (val.id === '9999') {
            hideArr.value.splice(index, 1);
          }
        });
      }
      dropItemId = '';
    };
    // 添加显示
    const itemDropEnd = (e: DragEvent, area: 'show' | 'hide', endTargetId: string) => {
      e.preventDefault();
      if (endTargetId === 'noId') {
        // 显示框添加
        if (area === 'show') {
          emit('itemDropEnd', titleName.value, dragItemId, 'show');
        }
        // 隐藏框添加
        if (area === 'hide') {
          emit('itemDropEnd', titleName.value, dragItemId, 'hide');
        }
      } else {
        // 显示项目标元素插入
        if (area === 'show') {
          emit('itemDropEnd', titleName.value, dragItemId, 'show', dropItemId);
        }
        // 隐藏项目标元素插入
        if (area === 'hide') {
          emit('itemDropEnd', titleName.value, dragItemId, 'show', dropItemId);
        }
      }
      dragItemId = '';
      dropItemId = '';
      e.dataTransfer?.clearData();
    };
    return {
      titleName,
      allowDrop,
      dragStart,
      dropEnd,
      showArr,
      hideArr,
      itemDragStart,
      allowItemDrop,
      itemDropEnd,
      addEmptyItem,
      removeEmptyItem
    };
  }
});
</script>

<style lang="scss" scoped>
$yellowColor: #ff6a00;
.k-feature-drag {
  user-select: none;
  & + .k-feature-drag {
    margin-top: 24px;
  }
  border: 1px solid $yellowColor;
  padding: 0 14px 14px 14px;
  .header-title {
    padding: 14px 14px;
    cursor: move;
    .iconfont {
      color: $yellowColor;
      font-size: 16px;
    }
    .title-text {
      font-size: 14px;
      color: #333;
      margin-left: 8px;
    }
  }
  .show-wrp,
  .hide-wrp {
    height: auto;
    min-height: 140px;
    border: 1px dashed $yellowColor;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding: 14px 0 0 14px;
    .item {
      flex: 0 0 auto;
      height: auto;
      margin-right: 14px;
      margin-bottom: 14px;
      cursor: move;
    }
  }
  .hide-wrp {
    margin-top: 14px;
    border: 1px dashed #ddd;
  }
}
</style>
