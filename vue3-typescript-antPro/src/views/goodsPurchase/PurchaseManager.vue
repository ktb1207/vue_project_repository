<template>
  <div>
    采购管理
  </div>
</template>

<script lang="ts">
import { defineComponent, onActivated } from 'vue';
export default defineComponent({
  setup() {
    onActivated(() => {
      console.log('唤醒了...');
    });
  }
});
</script>
