import { defineComponent, PropType, inject, ref, toRef, Ref, SetupContext } from 'vue';
import { ShowWay, ShowPosition, FontWeight } from '../componType';
import { useEditDrag } from '../useComponDrag';

import './style.scss';

export default defineComponent({
  name: 'KP',
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
    contentEdit: {
      type: Boolean,
      default: false,
      required: false
    },
    fontColor: {
      type: String,
      default: '#333',
      required: false
    },
    fontSize: {
      type: Number,
      default: 14,
      required: false
    },
    fontWeight: {
      type: String as PropType<FontWeight>,
      default: 'normal'
    }
  },
  setup(props, ctx: SetupContext) {
    const editActiveId = inject<Ref>('editId', ref(999999));
    const nowNodeId = toRef(props, 'nodeId');
    const showMethod = toRef(props, 'showWay');
    const overKey = inject<Ref>('dragKey');
    const { onEditDragOver, onEditDrop } = useEditDrag();
    const computedClass = (): string => {
      const editClass = props.showWay === 'edit' ? ' is-edit' : '';
      const isPreview = props.showPosition === 'preview' ? ' is-preview' : ' is-editview';
      const isActive = editActiveId?.value === nowNodeId.value ? ' ' + 'edit-active' : '';
      return 'k-p' + isPreview + editClass + isActive;
    };
    const fcolor = toRef(props, 'fontColor');
    const fsize = toRef(props, 'fontSize');
    const fweight = toRef(props, 'fontWeight');
    const dragOver = (e: DragEvent) => {
      if (showMethod.value === 'edit') {
        onEditDragOver(e, (overKey as Ref<any>)?.value, 'KP');
      }
    };
    const drop = (e: DragEvent) => {
      if (showMethod.value === 'edit') {
        onEditDrop(e, nowNodeId.value as number);
      }
    };
    return () => (
      <p
        class={computedClass()}
        style={{ color: fcolor.value, fontSize: fsize.value + 'px', fontWeight: fweight.value }}
        contenteditable={props.contentEdit}
        onDragover={(e) => dragOver(e)}
        onDrop={(e) => drop(e)}
      >
        {ctx.slots.default ? ctx.slots.default() : ''}
      </p>
    );
  }
});
