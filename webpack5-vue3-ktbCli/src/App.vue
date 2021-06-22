<template>
  <div>
    <Test></Test>
    <p>{{ result }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Test from '@/components/Test';
export default defineComponent({
  components: {
    Test
  },
  setup() {
    return {
      result: 12
    };
  }
});
</script>

<style lang="scss"></style>
