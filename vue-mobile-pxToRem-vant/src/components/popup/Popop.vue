<!--
  弹框组件
  :visible.sync= 显隐状态
  appent-to=添加节点位置，默认body,支持id和class
  popop-class=自定义弹框类名
  
-->
<template>
  <transition name="fade-popop">
    <div 
      class="custom-popop-wrp" 
      v-show="visible"
      :style="{'z-index':zIndex}"
      @click="hide" 
      :class="[popopClass]"
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PopopComponent',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    appentTo: {
      type: String,
      default: 'body',
    },
    popopClass: {
      type: String,
      default: '',
    }
  },
  components: {},
  data () {
    return {
      zIndex:1,
    };
  },
  computed: {},
  watch: {
    visible (newVal) {
      if (newVal) {
        // 自动计算显示层级
        let allElement = Array.from(document.querySelectorAll('*'));
        let zIndexNum = [];
        allElement.forEach(item => {
          let eleZindex = Number(window.getComputedStyle(item).zIndex) || 0;
          zIndexNum.push(eleZindex);
        });
        let maxNum = zIndexNum.length ? Math.max(...zIndexNum) : 0;
        this.zIndex = maxNum + 1;
      } else {
        this.zIndex = 1;
      }
    },
  },
  created () {},
  mounted () {
    this.$nextTick(() => {
      let el;
      if (this.appentTo === 'body') {
        el = document.querySelector('body');
      } else if (this.appentTo.indexOf('#') !== -1) {
        let inx = this.appentTo.indexOf('#') + 1;
        const idStr = this.appentTo.substring(inx);
        el = document.getElementById(idStr);
      } else if (this.appentTo.indexOf('.') !== -1) {
        let inx = this.appentTo.indexOf('#') + 1;
        const idStr = this.appentTo.substring(inx);
        el = document.getElementsByClassName(idStr);
      }else {
        el = document.querySelector('body');
      }
      if (el.append) {
        el.append(this.$el);
      } else {
        el.appendChild(this.$el);
      }
    });
  },
  beforeDestory () {},
  methods: {
    hide() {
      this.$emit('update:visible', false);
    }
  }
};
</script>

<style lang='less' scoped>
.custom-popop-wrp{
  position: absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  background-color: rgba(0, 0, 0, 0.1);
}
// 进入
.fade-popop-enter{
  opacity: 0;
  transform: scale(0);
}
.fade-popop-enter-active{
  transition: all 0.2s ease
}
.fade-popop-enter-to{
  opacity: 1;
  transform: scale(1);
}
// 离开
.fade-popop-leave{
  opacity: 1;
  transform: scale(1);
}
.fade-popop-leave-active{
  transition: all 0.3s ease
}
.fade-popop-leave-to{
  opacity: 0;
  transform: scale(0.9);
}
</style>