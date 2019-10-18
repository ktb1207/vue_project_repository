<style lang="less">
@hover-color: #0190fe;
.box-img {
  .icon-weixuanzhong {
    color: #bfcbd9;
    &:hover {
      color: @hover-color;
      font-weight: 500;
    }
  }
  .icon-xuanzhong {
    color: @hover-color;
    font-weight: 500;
  }
  .icon-fujiedianxuanzhong {
    color: @hover-color;
    font-weight: 500;
  }
  .disabled {
    color: #999;
    cursor: not-allowed;
    &:hover {
      color: #999;
    }
  }
}
</style>
<template>
  <span class="box-img" @click="boxClick">
    <i class="iconfont icon-xuanzhong" :class="disabled ? 'disabled':''" v-if="checkedStatus"></i>
    <i
      class="iconfont icon-fujiedianxuanzhong"
      :class="disabled ? 'disabled':''"
      v-else-if="banStatus"
    ></i>
    <i class="iconfont icon-weixuanzhong" :class="disabled ? 'disabled':''" v-else></i>
  </span>
</template>
<script>
import './treeIcon/iconfont.css';
export default {
  name: 'BoxImg',
  props: {
    propValue: {
      type: Object,
      default() {
        return {};
      }
    },
    checkedStatus: {
      type: Boolean,
      default: false
    },
    banStatus: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {},
  components: {},
  watch: {},
  methods: {
    boxClick() {
      if (!this.disabled) {
        this.$emit('checkChange', this.propValue);
      }
    }
  }
};
</script>