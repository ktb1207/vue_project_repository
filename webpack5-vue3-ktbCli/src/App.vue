<template>
  <div class="test">
    {{ helloStr }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const helloStr = ref('ref hello');

    return {
      helloStr
    };
  }
});
</script>

<style scoped lang="less">
.test {
  color: red;
}
</style>
