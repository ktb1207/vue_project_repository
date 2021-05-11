<template>
  <ElSelect
    v-model="selected"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    @change="handleSelect"
    @clear="handleClear"
  >
    <ElOption v-for="item in selectOptions" :key="item.value" :value="item.value" :label="item.label" />
  </ElSelect>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { ElSelect, ElOption } from 'element-plus';

export default defineComponent({
  name: 'Selector',
  components: {
    ElSelect,
    ElOption
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
    },
    placeholder: {
      type: String,
      default: () => {
        return '请选择';
      }
    },
    clearable: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  setup(props, { emit }) {
    const selected = ref<string>(props.modelValue);
    const handleSelect = (val: string) => {
      emit('update:modelValue', val);
    };
    const handleClear = () => {
      emit('update:modelValue', '');
    };
    watch(
      () => props.modelValue,
      () => {
        selected.value = props.modelValue;
      }
    );
    return { selected, handleSelect, handleClear };
  }
});
</script>
<style lang="scss">
@import '@/components/systemManage/styles/index.scss';
</style>
