import { defineComponent, PropType, toRef } from 'vue';
import { ElInput } from 'element-plus';
import { renderWayType } from '../shareType';
import './style.scss';
export default defineComponent({
  name: 'KInput',
  components: {
    ElInput
  },
  props: {
    nodeId: {
      type: Number,
      default: 0,
      required: false
    },
    // 渲染位置
    renderWay: {
      type: String as PropType<renderWayType>,
      default: 'preview',
      required: false
    },
    labelText: {
      type: String,
      default: 'label'
    },
    labelWidth: {
      type: String,
      default: '140px'
    },
    inputSize: {
      type: String as PropType<'default' | 'large' | 'small'>,
      default: 'default'
    },
    onFocus: {
      type: Function as PropType<(e: FocusEvent) => void>,
      required: false
    },
    onBlur: {
      type: Function as PropType<(e: FocusEvent) => void>,
      required: false
    },
    onInput: {
      type: Function as PropType<(value: string | number) => void>,
      required: false
    }
  },
  setup(props) {
    const labelWidth = toRef(props, 'labelWidth');
    const iSize = toRef(props, 'inputSize');

    function inputFocus(e: FocusEvent) {
      props.onFocus && props.onFocus(e);
    }
    function inputBlur(e: FocusEvent) {
      props.onBlur && props.onBlur(e);
    }
    function inputing(value: string | number) {
      props.onInput && props.onInput(value);
    }
    return () => (
      <div class="k-input">
        <div
          class="input-label"
          style={{ flex: labelWidth.value.endsWith('px') ? `0 0 ${labelWidth.value}` : labelWidth.value }}
        >
          {props.labelText}
        </div>
        <div class="input-main">
          <ElInput size={iSize.value} onFocus={inputFocus} onBlur={inputBlur} onInput={inputing}></ElInput>
        </div>
      </div>
    );
  }
});
