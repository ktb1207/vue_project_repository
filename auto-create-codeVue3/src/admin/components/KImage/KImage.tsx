import { defineComponent, PropType, inject, Ref, ref, toRef } from 'vue';
import './style.scss';
import { ShowWay, ShowPosition } from '../componType';
import { useEditDrag } from '../useComponDrag';
// import kPreviewImage from './k_img_preview.png';
import kEditviewImage from './k_img_editview.png';

export default defineComponent({
  name: 'KImage',
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
    }
  },
  setup(props) {
    const editActiveId = inject<Ref>('editId', ref(999999));
    const nowNodeId = toRef(props, 'nodeId');
    const showMethod = toRef(props, 'showWay');
    const overKey = inject<Ref>('dragKey', ref(''));
    const { onEditDragOver, onEditDrop } = useEditDrag();
    const computedClass = (): string => {
      const editClass = props.showWay === 'edit' ? ' is-edit' : '';
      const isPreview = props.showPosition === 'preview' ? ' is-preview' : ' is-editview';
      const isActive = editActiveId?.value === nowNodeId.value ? ' ' + 'edit-active' : '';
      return 'k-image' + isPreview + editClass + isActive;
    };
    const dragOver = (e: DragEvent) => {
      if (showMethod.value === 'edit') {
        onEditDragOver(e, (overKey as Ref<any>)?.value, 'KImage');
      }
    };
    const drop = (e: DragEvent) => {
      if (showMethod.value === 'edit') {
        onEditDrop(e, nowNodeId.value as number);
      }
    };
    return () => (
      <img
        class={computedClass()}
        src={kEditviewImage}
        alt="kimage"
        onDragover={(e) => dragOver(e)}
        onDrop={(e) => drop(e)}
      />
    );
  }
});
