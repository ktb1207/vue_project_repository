import { defineComponent, PropType } from 'vue';
import style from '../style.module.scss';
export default defineComponent({
  name: 'KSPButton',
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
    const buttonClick = () => {
      emit('itemChange', props.valueKey, props.labelValue);
    };
    return () => (
      <div class={style.propItem}>
        <div class={style.propLable}>{props.label}</div>
        <div>
          <button onClick={buttonClick}>{props.labelValue}</button>
        </div>
      </div>
    );
  }
});
