<template>
  <div class="router-view">
    <Tabs :item-arr="tabsItem" @tab-click="tabClick"></Tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import Tabs from '@/components/Tabs.vue';

export default defineComponent({
  name: 'Home',
  components: {
    Tabs
  },
  data() {
    return {
      tabsItem: ['tab1', 'tab2']
    };
  },
  methods: {
    tabClick(index: number): void {
      console.log(index);
    }
  },
  mounted() {
    const instance = getCurrentInstance();
    console.log(instance, '当前组件的实例');
  }
});
</script>
