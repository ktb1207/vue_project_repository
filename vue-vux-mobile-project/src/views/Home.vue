<style lang="less">
.max-height-page {
}
</style>
<template>
  <div class="max-height-page">
    <x-button type="primary" @click.native="goDrawDetials">提料单</x-button>
  </div>
</template>
<script>
import { XButton } from 'vux';
export default {
  name: 'Home',
  props: {},
  data() {
    return {};
  },
  computed: {},
  components: {
    XButton
  },
  watch: {},
  methods: {
    goDrawDetials() {
      this.$router.push({
        name: 'drawShare',
        params: { projectId: '261045679448576', shareId: '279019005659807744' }
      });
    }
  },
  created() {},
  mounted() {},
  updated() {},
  beforeDestroy() {}
};
</script>
