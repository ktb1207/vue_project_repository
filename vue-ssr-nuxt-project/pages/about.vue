<template>
  <div class="about-page">
    <p>关于页面</p>
    <p>{{ getData }}</p>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      getData: null,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
  },
  beforeDestory() {},
  methods: {},
}
</script>

<style lang="less" scoped>
.about-page {
  font-size: 16px;
}
</style>
