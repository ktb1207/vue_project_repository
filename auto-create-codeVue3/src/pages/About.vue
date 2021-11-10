<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="add">+{{ value1 }}</button>
    <p contenteditable="true">p段落内容可编辑</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUpdated } from 'vue';
export default defineComponent({
  setup() {
    const value1 = ref(1);

    const add = () => {
      value1.value++;
    };
    onUpdated(() => {
      console.log('updated');
    });
    return {
      add,
      value1
    };
  }
});
</script>
