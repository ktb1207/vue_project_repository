import { defineComponent, PropType, SetupContext, toRef } from 'vue';
import { renderWayType } from '../shareType';
import './style.scss';

export default defineComponent({
  name: 'KRow',
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
    // 水平对齐方式
    horizontalAlign: {
      type: String as PropType<'left' | 'center' | 'right' | 'between' | 'around'>,
      default: 'left',
      required: false
    },
    // 垂直对齐方式
    verticalAlign: {
      type: String as PropType<'top' | 'middle' | 'bottom' | 'stretch'>,
      default: 'stretch',
      required: false
    }
  },
  setup(props, ctx: SetupContext) {
    const renderPosition = toRef(props, 'renderWay');
    const computedClass = (): string => {
      const editStyle = renderPosition.value === 'edit' ? ' ' + 'is-edit' : '';
      // 水平flex
      let flexStyle = '';
      switch (props.horizontalAlign) {
        case 'left':
          flexStyle = ' ' + 'flex-left';
          break;
        case 'center':
          flexStyle = ' ' + 'flex-center';
          break;
        case 'right':
          flexStyle = ' ' + 'flex-right';
          break;
        case 'between':
          flexStyle = ' ' + 'flex-between';
          break;
        case 'around':
          flexStyle = ' ' + 'flex-around';
          break;
        default:
          flexStyle = ' ' + 'flex-left';
          break;
      }
      // 垂直flex
      let verStyle = '';
      switch (props.verticalAlign) {
        case 'top':
          verStyle = ' ' + 'vertical-top';
          break;
        case 'middle':
          verStyle = ' ' + 'vertical-middle';
          break;
        case 'bottom':
          verStyle = ' ' + 'vertical-bottom';
          break;
        case 'stretch':
          verStyle = ' ' + 'vertical-stretch';
          break;
        default:
          verStyle = ' ' + 'vertical-middle';
          break;
      }
      return 'k-row' + editStyle + flexStyle + verStyle;
    };
    return () => <div class={computedClass()}>{ctx.slots.default ? ctx.slots.default() : ''}</div>;
  }
});
