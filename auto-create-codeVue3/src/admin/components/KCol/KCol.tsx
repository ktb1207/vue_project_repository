import { defineComponent, SetupContext, PropType, toRef, computed, inject, Ref, ref } from 'vue';
import { ShowWay, ShowPosition } from '../componType';
import './style.scss';

interface PropsType {
  nodeId?: number;
  // 展示方式
  showWay?: ShowWay;
  // 展示位置
  showPosition?: ShowPosition;
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
    nodeId: {
      type: Number,
      default: 0,
      required: false
    },
    showWay: {
      type: String as PropType<ShowWay>,
      default: 'show',
      required: false
    },
    showPosition: {
      type: String as PropType<ShowPosition>,
      default: 'preview',
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
    const editActiveId = inject<Ref>('editId', ref(999999));
    const nowId = toRef(props, 'nodeId');
    const computedClass = (): string => {
      const editClass = props.showWay === 'edit' ? ' is-edit' : '';
      const isPreview = props.showPosition === 'preview' ? ' is-preview' : ' is-editview';
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
      const isActive = editActiveId?.value === nowId.value ? ' ' + 'edit-active' : '';
      return 'k-col' + isPreview + editClass + flexDirectionClass + isActive;
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
