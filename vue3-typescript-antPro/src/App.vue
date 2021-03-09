<template>
  <router-view />
  <ModalLoading :show="loadingStatus" :target-dom="loadingDom" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { mainStorekey } from '@/store/index';
import ModalLoading from '@/components/ModalLoading.vue';
export default defineComponent({
  components: {
    ModalLoading
  },
  setup() {
    const store = useStore(mainStorekey);
    return {
      loadingStatus: computed(() => store.state.loadingStatus),
      loadingDom: computed(() => store.state.loadingDom)
    };
  }
});
</script>

<style lang="scss"></style>
