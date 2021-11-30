import { defineComponent, ref, watch, toRef, PropType } from 'vue';
import style from './style.module.scss';
export default defineComponent({
  name: 'PText',
  emits: ['itemChange'],
  props: {
    label: {
      type: String,
      default: 'label',
      required: false
    },
    labelValue: {
      type: String,
      default: '',
      required: false
    },
    valueKey: {
      type: String,
      default: 'valueKey',
      required: false
    },
    valueSelect: {
      type: String,
      default: '',
      required: false
    },
    itemChange: {
      type: Function as PropType<(key: string, value: string) => void>,
      required: false
    }
  },
  setup(props, { emit }) {
    const initValue = toRef(props, 'labelValue');
    const moduleValue = ref<string>(initValue.value);
    let oldInputValue = moduleValue.value;
    const sureClick = () => {
      if (oldInputValue === moduleValue.value) {
        return;
      }
      oldInputValue = moduleValue.value;
      emit('itemChange', props.valueKey, moduleValue.value);
    };
    return () => (
      <div class={style.propItem}>
        <div class={style.propLable}>{props.label}</div>
        <div>
          <input type="text" class={style.propInput} v-model={moduleValue.value} />
          <button class={style.inputAfterButton} onClick={sureClick}>
            确认
          </button>
        </div>
      </div>
    );
  }
});
