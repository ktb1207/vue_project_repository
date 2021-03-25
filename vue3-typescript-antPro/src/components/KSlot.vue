<template>
  <div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'KSlot',
  mounted() {
    console.log((this.$slots.default as Function)());
  }
});
</script>
