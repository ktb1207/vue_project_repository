<template>
  <div>{{ state.num }}</div>
</template>

<script lang="ts">
import { ref, Ref } from 'vue';
import { Options, Vue, setup } from 'vue-class-component';
interface ICounter {
  num: Ref<string>;
}
function useCounter(): ICounter {
  const num: Ref<string> = ref('hello ref');
  return {
    num
  };
}
@Options({})
export default class AddNum extends Vue {
  state = setup(() => useCounter());
}
</script>

<style lang="scss"></style>
