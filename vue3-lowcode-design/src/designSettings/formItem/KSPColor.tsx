import { defineComponent, PropType, toRef, ref, watch } from 'vue';
import style from '../style.module.scss';
export default defineComponent({
  name: 'KSPColor',
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
    watch(moduleValue, (newVal) => {
      emit('itemChange', props.valueKey, newVal);
    });
    return () => (
      <div class={style.propItem}>
        <div class={style.propLable}>{props.label}</div>
        <div>
          <input type="color" class={style.propInput} v-model={moduleValue.value} />
        </div>
      </div>
    );
  }
});
