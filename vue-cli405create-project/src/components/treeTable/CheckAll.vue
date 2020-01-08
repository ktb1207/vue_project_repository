<style lang="less">
@hover-color: #0190fe;
@no-checkColor: #bfcbd9;
.box-img {
  .icon-weixuanzhong {
    color:@no-checkColor;
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
    background-color: #cecece;
    &:hover {
      color: #999;
    }
  }
}
</style>
<template>
  <span class="box-img" @click="boxClick">
    <i class="iconfont icon-xuanzhong" :class="disabled ? 'disabled':''" v-if="checkedStatus === 'all'"></i>
    <i class="iconfont icon-weixuanzhong" :class="disabled ? 'disabled':''" v-else-if="checkedStatus === 'empty'"></i>
    <i class="iconfont icon-fujiedianxuanzhong" :class="disabled ? 'disabled':''" v-else></i>
  </span>
</template>
<script>
import './treeIcon/iconfont.css';
export default {
  name: 'CheckAll',
  props: {
    checkedStatus: {
      // empty all concat
      type: String,
      default: 'empty'
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
        if (this.checkedStatus === 'empty' || this.checkedStatus === 'concat') {
          this.$emit('allCheck', 'all');
        } else {
          this.$emit('allCheck', 'empty');
        }
      }
    }
  }
};
</script>
