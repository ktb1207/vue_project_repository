<template>
  <div class="about">
    <h1>This is an home page</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useAuthority from '@/utils/authority';
export default defineComponent({
  setup() {
    // 页面范文权限
    useAuthority('A');
  }
});
</script>
