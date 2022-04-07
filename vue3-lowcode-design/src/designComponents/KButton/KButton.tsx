import { defineComponent, PropType, toRef } from 'vue';
import { ElButton } from 'element-plus';
import { renderWayType } from '../shareType';

export default defineComponent({
  name: 'KButton',
  components: {
    ElButton
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
    size: {
      type: String as PropType<'large' | 'default' | 'small'>,
      default: 'default'
    },
    type: {
      type: String as PropType<'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'>,
      default: 'default'
    },
    text: {
      type: String,
      default: 'button'
    },
    onClick: {
      type: Function as PropType<(e: MouseEvent) => void>,
      required: false
    }
  },
  setup(props) {
    const btnSize = toRef(props, 'size');
    const btnType = toRef(props, 'type');
    const btnText = toRef(props, 'text');
    function btnClick(e: MouseEvent) {
      props.onClick && props.onClick(e);
    }
    return () => (
      <ElButton size={btnSize.value} type={btnType.value} onClick={btnClick}>
        {btnText.value}
      </ElButton>
    );
  }
});
