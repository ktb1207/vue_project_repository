<style lang="less">
.model-title {
  height: 35px;
  line-height: 35px;
  border-bottom: 1px solid #dbdbdb;
  display: flex;
  flex-wrap: nowrap;
  padding-right: 16px;
  .left-title {
    flex: 0 0 auto;
    span {
      font-weight: 600;
      color: #1e91ff;
      font-size: 14px;
      border-left: 4px solid #1e91ff;
      padding-left: 14px;
    }
  }
  .flex-center {
    flex: 1 1 auto;
  }
  .flex-right {
    flex: 1 1 auto;
  }
}
</style>
<template>
  <div class="model-title">
    <div class="left-title">
      <span>{{titleName}}</span>
    </div>
    <div class="flex-center">
      <slot name="center"></slot>
    </div>
    <div class="flex-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ModelTitle',
  props: {
    titleName: {
      type: String,
      default: '标题名称'
    }
  }
};
</script>
