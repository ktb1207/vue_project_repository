<template>
  <popop-component :visible.sync="showPop">
    <div class="rotate-loading"></div>
  </popop-component>
</template>

<script>
import PopopComponent from '../popup/Popop.vue';
export default {
  name: 'PopopLoading',
  props: {},
  components: {
    PopopComponent
  },
  data () {
    return {
      showPop: false
    };
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
.rotate-loading{
  height:240px;
  width:240px;
  border-width: 6px;
  border-style: solid;
  border-top-color: #1989fa;
  border-right-color: #07c160;
  border-bottom-color: #1989fa;
  border-left-color: #07c160;
  animation:myrotate 2s linear infinite;
}
@keyframes myrotate
{
  0% {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}
}
</style>