import { defineComponent, SetupContext, PropType, toRef, computed } from 'vue';
import './style.scss';

interface PropsType {
  // 展示方式
  showWay?: 'edit' | 'show';
  // 展示位置
  showPosition?: '' | 'preview';
  // 宽度
  width?: string; // auto, 48px 1 2 3、
  // 子元素排列方向
  flexDirection?: 'row' | 'col';
  // 主轴对齐
  mainAlign?: 'start' | 'center' | 'end' | 'between' | 'around';
  // 交叉轴对齐
  crossAlign?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
}
export default defineComponent({
  name: 'KCol',
  props: {
    showWay: {
      type: String as PropType<'edit' | 'show'>,
      default: 'show',
      required: false
    },
    showPosition: {
      type: String as PropType<'' | 'preview'>,
      default: '',
      required: false
    },
    width: {
      type: String,
      default: '1',
      required: false
    },
    flexDirection: {
      type: String as PropType<'row' | 'col'>,
      default: 'row',
      required: false
    },
    mainAlign: {
      type: String as PropType<'start' | 'center' | 'end' | 'between' | 'around'>,
      default: 'start',
      required: false
    },
    crossAlign: {
      type: String as PropType<'flex-start' | 'center' | 'flex-end' | 'stretch'>,
      default: 'stretch',
      required: false
    }
  },
  setup(props: PropsType, ctx: SetupContext) {
    const computedClass = (): string => {
      const editClass = props.showWay === 'edit' ? ' is-edit' : '';
      const isPreview = props.showPosition === 'preview' ? ' is-preview' : '';
      let flexDirectionClass = '';
      switch (props.flexDirection) {
        case 'row':
          flexDirectionClass = ' flex-row';
          break;
        case 'col':
          flexDirectionClass = ' flex-col';
          break;
        default:
          flexDirectionClass = ' flex-row';
          break;
      }
      return 'k-col' + isPreview + editClass + flexDirectionClass;
    };
    const mainAlignClass = props.mainAlign === 'center' ? 'center' : `flex-${props.mainAlign}`;
    const crossAlignClass = toRef(props, 'crossAlign').value;
    const refWidth = toRef(props, 'width');
    const computedWidth = computed(() => {
      const pxReg = /^(\d+(px))$/;
      if (refWidth.value === 'auto') {
        return '0 0 auto';
      }
      if (pxReg.test(refWidth.value as string)) {
        return `0 0 ${refWidth.value}`;
      }
      if (typeof Number(refWidth.value) === 'number') {
        return refWidth.value;
      }
      return '1';
    });
    return () => (
      <div
        class={computedClass()}
        style={{ flex: computedWidth.value, justifyContent: mainAlignClass, alignItems: crossAlignClass }}
      >
        {ctx.slots.default ? ctx.slots.default() : ''}
      </div>
    );
  }
});
