import { defineComponent, PropType, toRef, ref, watch } from 'vue';
import './style.scss';

type InputType = 'text' | 'number' | 'color' | 'tel';

export default defineComponent({
  name: 'KInput',
  emits: ['update:modelValue'],
  props: {
    type: {
      type: String as PropType<InputType>,
      default: 'text',
      required: false
    },
    onChange: {
      type: Function as PropType<() => void>,
      required: false
    },
    modelValue: {
      type: String,
      default: '',
      required: false
    }
  },
  setup(props, { emit }) {
    const inputType = toRef(props, 'type');
    const inputValue = toRef(props, 'modelValue');
    const testValue = ref<string>(inputValue.value);
    watch(
      () => testValue.value,
      (newVal) => {
        emit('update:modelValue', newVal);
      }
    );
    return () => <input type={inputType.value} class={'k-input'} v-model={testValue.value} />;
  }
});
