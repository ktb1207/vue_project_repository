<template>
  <div class="k-feature-pre" :class="{ 'no-active': nowTheme === 'no-active', 'no-pointer': isRendonly }">
    <p class="icon-p">
      <i class="iconfont" :class="[props.iconfontName]"></i>
    </p>
    <p class="title">{{ props.title }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRef } from 'vue';

interface Props {
  // 标题
  title?: string;
  // 图标
  iconfontName?: string;
  // 是否只读
  readonly?: boolean;
  // 主题
  theme?: 'active' | 'no-active';
}
export default defineComponent({
  name: 'KFeaturePre',
  props: {
    title: {
      type: String,
      required: false,
      default: '标题'
    },
    iconfontName: {
      type: String,
      required: false,
      default: 'icon-liuchengguanli'
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    theme: {
      type: String as PropType<'active' | 'no-active'>,
      required: false,
      default: 'active'
    }
  },
  setup(props: Props) {
    const nowTheme = toRef(props, 'theme');
    const isRendonly = toRef(props, 'readonly');
    return {
      props,
      nowTheme,
      isRendonly
    };
  }
});
</script>

<style lang="scss" scoped>
$yellowColor: #ff6a00;
.k-feature-pre {
  width: 110px;
  height: 110px;
  margin: 0 auto;
  border: 1px solid #ddd;
  position: relative;
  cursor: pointer;
  .icon-p {
    text-align: center;
    padding-top: 18px;
    .iconfont {
      color: $yellowColor;
      font-size: 42px;
    }
  }
  .title {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 14px;
    font-size: 14px;
    text-align: center;
    color: #656565;
  }
}
// 灰显状态
.k-feature-pre.no-active {
  .iconfont,
  .title {
    color: #ccc;
  }
}
.no-pointer {
  cursor: move;
}
</style>
