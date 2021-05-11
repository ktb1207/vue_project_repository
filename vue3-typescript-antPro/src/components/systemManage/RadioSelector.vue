<template>
  <ElRadioGroup v-model="selected" @change="handleSelect">
    <ElRadio v-for="item in selectOptions" :key="item.value" :label="item.value">{{ item.label }}</ElRadio>
  </ElRadioGroup>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { ElRadioGroup, ElRadio } from 'element-plus';

export default defineComponent({
  name: 'RadioSelector',
  components: {
    ElRadioGroup,
    ElRadio
  },
  props: {
    modelValue: {
      type: String,
      default: () => {
        return '';
      }
    },
    selectOptions: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  setup(props, { emit }) {
    const selected = ref<string>(props.modelValue);
    const handleSelect = (val: string) => {
      emit('update:modelValue', val);
    };
    watch(
      () => props.modelValue,
      () => {
        selected.value = props.modelValue;
      }
    );
    return { selected, handleSelect };
  }
});
</script>
<style lang="scss">
@import '@/components/systemManage/styles/index.scss';
</style>
