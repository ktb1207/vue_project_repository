<template>
  <transition name="drop">
    <div class="message-info" :class="type" v-show="show">
      <span class="message-text">{{text}}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Message',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: val => ['info', 'success', 'waring', 'error'].includes(val)
    },
    text: {
      type: String,
      default: '我是一条消息'
    },
    show: {
      type: Boolean,
      default: false,
    }
  },
  components: {},
  data () {
    return {};
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  beforeDestory () {},
  methods: {}
};
</script>

<style lang='less' scoped>
.message-info{
  position:fixed;
  top:100px;
  left:50%;
  transform: translate(-50%,0);
  z-index:99;
  background: fuchsia;
  color:#fff;
  font-size:36px;
}

// 进入
.drop-enter{
  opacity: 0;
  top:0px;
}
.drop-enter-active{
  transition: all 0.3s ease
}
.drop-enter-to{
  opacity: 1;
  top:100px;
}
// 离开
.drop-leave{
  opacity: 1;
  top:100px;
}
.drop-leave-active{
  transition: all 0.3s ease
}
.drop-leave-to{
  opacity: 0;
  top:0;
}
</style>