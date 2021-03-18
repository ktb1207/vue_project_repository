<template>
  <teleport :to="insertDom">
    <transition name="fade" appear>
      <div v-show="isShow" class="modal-loading">
        <div class="center">
          <Spin size="large" />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, SetupContext, toRef } from 'vue';
import { Spin } from 'ant-design-vue';
interface Props {
  targetDom: string;
  show: boolean;
}
export default defineComponent({
  name: 'ModalLoading',
  props: {
    targetDom: {
      type: String,
      default: 'body'
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Spin
  },
  setup(props: Props, context: SetupContext) {
    console.log(props);
    console.log(context);
    const isShow = toRef(props, 'show');
    const insertDom = toRef(props, 'targetDom');
    return {
      isShow,
      insertDom
    };
  }
});
</script>

<style lang="scss" scoped>
.modal-loading {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(244, 244, 244, 0.2);
  transform: translateZ(0);
  .center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.fade-enter-form {
  opacity: 1;
  transform: scale(0.2, 0.2);
}
.fade-enter-active {
  transition: all 0.3s ease;
}
.fade-enter-to {
  opacity: 0.1;
  transform: scale(0.9, 0.9);
}
.fade-leave-form {
  opacity: 1;
  transform: scale(0.9, 0.9);
}
.fade-leave-active {
  transition: all 0.3s ease-out;
}
.fade-leave-to {
  opacity: 0;
  transform: scale(0.2, 0.2);
}
</style>
