import { defineComponent, PropType, toRef, ref, watch } from 'vue';
import style from './style.module.scss';
export default defineComponent({
  name: 'PSelect',
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
      type: Array as PropType<Array<string>>,
      default: () => [],
      required: false
    },
    itemChange: {
      type: Function as PropType<(key: string, value: string) => void>,
      required: false
    }
  },
  setup(props, { emit }) {
    const options = toRef(props, 'valueSelect');
    const optionValue = toRef(props, 'labelValue');
    const moduleValue = ref(optionValue.value);
    watch(moduleValue, (newVal) => {
      emit('itemChange', props.valueKey, newVal);
    });
    console.log(optionValue.value);
    return () => (
      <div class={style.propItem}>
        <div class={style.propLable}>{props.label}</div>
        <div>
          <select name="select" class={style.propInput} v-model={moduleValue.value}>
            {options.value.map((item) => {
              return <option value={item}>{item}</option>;
            })}
          </select>
        </div>
      </div>
    );
  }
});
