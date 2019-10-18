<style lang="less">
.dialog-module {
  .el-dialog__header {
    padding: 10px 20px 10px;
    border-bottom: 1px solid #e4e8f4;
    .el-dialog__title {
      color: #333333;
      font-size: 16px;
      font-weight: 500;
    }
    .el-dialog__headerbtn {
      top: 10px;
      font-size: 18px;
    }
  }
  .el-dialog__body {
    border-bottom: 1px solid #e4e8f4;
    padding: 0 20px;
    .content-slot {
      width: 100%;
    }
  }
  .el-dialog__footer {
    padding: 10px 20px;
  }
}
</style>
<template>
  <div class="dialog-module">
    <el-dialog
      :title="dialogTitle"
      :visible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :width="dialogWidth"
    >
      <!-- content -->
      <div class="content-slot">
        <slot name="content"></slot>
      </div>
      <!-- footer -->
      <div slot="footer">
        <slot name="footer"></slot>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'DialogModule',
  props: {
    dialogTitle: {
      type: String,
      default: '标题'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: String,
      default: '40%'
    }
  },
  data() {
    return {};
  },
  computed: {},
  components: {},
  watch: {},
  methods: {
    // x关闭
    handleClose(done) {
      this.$emit('update:dialog-visible', false);
    }
  }
};
</script>