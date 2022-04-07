import { defineComponent, SetupContext, PropType, toRef, computed } from 'vue';
import { renderWayType } from '../shareType';

import './style.scss';
export default defineComponent({
  name: 'KCol',
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
  setup(props, ctx: SetupContext) {
    const renderPosition = toRef(props, 'renderWay');
    const computedClass = (): string => {
      const editClass = renderPosition.value === 'edit' ? ' is-edit' : '';
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
      return 'k-col' + editClass + flexDirectionClass;
    };

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

    const mainPropValue = toRef(props, 'mainAlign');
    const mainAlignStyle = computed(() => {
      let value = 'flex-start';
      switch (mainPropValue.value) {
        case 'around':
          value = 'space-around';
          break;
        case 'between':
          value = 'space-between';
          break;
        case 'center':
          value = 'center';
          break;
        case 'end':
          value = 'flex-end';
          break;
        default:
          value = 'flex-start';
      }
      return value;
    });

    const crossPropValue = toRef(props, 'crossAlign');
    const crossAlignStyle = computed(() => {
      let value = 'stretch';
      switch (crossPropValue.value) {
        case 'center':
          value = 'center';
          break;
        case 'flex-start':
          value = 'flex-start';
          break;
        case 'flex-end':
          value = 'flex-end';
          break;
        case 'stretch':
          value = 'stretch';
          break;
        default:
          break;
      }
      return value;
    });

    return () => (
      <div
        class={computedClass()}
        style={{ flex: computedWidth.value, justifyContent: mainAlignStyle.value, alignItems: crossAlignStyle.value }}
      >
        {ctx.slots.default ? ctx.slots.default() : ''}
      </div>
    );
  }
});
