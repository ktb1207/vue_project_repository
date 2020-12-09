<template>
  <div class="container">
    <p>首页</p>
    <p>asyncData获得数据</p>
  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {},
  props: {},
  async asyncData(context) {
    // const axios = context.$axios
    // const pageData = await axios.$get(
    //   '/hrd-ess-service/api/v1/ess/baseInfo?token=CmYAMhiewiG3pbUWo9V2Q84TOmvyolcd'
    // )
    // return { pageData }
  },
  data() {
    return {
      name: 'tom',
    }
  },
  computed: {},
  watch: {},
  created() {
    console.log('created index')
  },
  mounted() {
    console.log('mounted index')
  },
}
</script>

<style>
.container {
}
</style>
