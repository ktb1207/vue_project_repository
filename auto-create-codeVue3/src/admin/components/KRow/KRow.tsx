import { defineComponent, PropType, SetupContext, inject, Ref, toRef, ref } from 'vue';
import { useEditDrag } from '../useComponDrag';
import { ShowWay, ShowPosition } from '../componType';
import './style.scss';

interface PropsType {
  nodeId?: number;
  showWay?: ShowWay;
  showPosition?: ShowPosition;
  align?: 'left' | 'center' | 'right' | 'between' | 'around';
  verticalAlign?: 'top' | 'middle' | 'bottom' | 'stretch';
}

export default defineComponent({
  name: 'KRow',
  props: {
    nodeId: {
      type: Number,
      default: 0,
      required: false
    },
    // 展示方式
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
    // 水平对齐方式
    align: {
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
  setup(props: PropsType, ctx: SetupContext) {
    const editActiveId = inject<Ref>('editId', ref(999999));
    const showMethod = toRef(props, 'showWay');
    const nowNodeId = toRef(props, 'nodeId');
    const { onEditDragOver, onEditDrop } = useEditDrag();
    const overKey = showMethod.value === 'edit' && inject<Ref>('dragKey');
    const computedClass = () => {
      // 编辑
      const editStyle = props.showWay === 'edit' ? ' ' + 'is-edit' : '';
      const isPreview = props.showPosition === 'preview' ? ' is-preview' : ' is-editview';
      // 水平flex
      let flexStyle = '';
      switch (props.align) {
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
      const isActive = editActiveId?.value === nowNodeId.value ? ' ' + 'edit-active' : '';
      return 'k-row' + isPreview + flexStyle + verStyle + editStyle + isActive;
    };
    const dragOver = (e: DragEvent) => {
      if (showMethod.value === 'edit') {
        onEditDragOver(e, (overKey as Ref<any>)?.value, 'KRow');
      }
    };
    const drop = (e: DragEvent) => {
      if (showMethod.value === 'edit') {
        onEditDrop(e, nowNodeId.value as number);
      }
    };
    return () => (
      <div class={computedClass()} onDragover={(e) => dragOver(e)} onDrop={(e) => drop(e)}>
        {ctx.slots.default ? ctx.slots.default() : ''}
      </div>
    );
  }
});
