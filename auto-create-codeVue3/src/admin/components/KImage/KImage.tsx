import { defineComponent, PropType, inject, Ref, ref, toRef, computed, watch } from 'vue';
import './style.scss';
import { ShowWay, ShowPosition } from '../componType';
import { useEditDrag } from '../useComponDrag';
import sysApi from '@/admin/api/index';
import kPreviewImage from './k_img_preview.png';
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
    },
    imageName: {
      type: String,
      default: 'default.png',
      required: false
    }
  },
  setup(props) {
    const editActiveId = inject<Ref>('editId', ref(999999));
    const nowNodeId = toRef(props, 'nodeId');
    const showMethod = toRef(props, 'showWay');
    const showLocation = toRef(props, 'showPosition');
    const overKey = inject<Ref>('dragKey', ref(''));
    const { onEditDragOver, onEditDrop } = useEditDrag();
    const computedClass = (): string => {
      const editClass = props.showWay === 'edit' ? ' is-edit' : '';
      const isPreview = props.showPosition === 'preview' ? ' is-preview' : ' is-editview';
      const isActive = editActiveId?.value === nowNodeId.value ? ' ' + 'edit-active' : '';
      return 'k-image' + isPreview + editClass + isActive;
    };
    const imagePropName = toRef(props, 'imageName');
    const computedImageUrl = computed(() => {
      if (showLocation.value === 'preview') {
        return kPreviewImage;
      } else {
        return kEditviewImage;
      }
    });
    const editViewImageUrl = ref(computedImageUrl.value);
    watch(imagePropName, (newVal) => {
      if (newVal) {
        sysApi.getImageBase({ imageName: newVal }).then((res) => {
          if (res.code === 200) {
            editViewImageUrl.value = res.data.dataSrc;
            console.log(res.data.dataSrc);
          }
        });
      }
    });
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
    const imgError = (e: Event) => {
      console.log(e);
    };
    return () => (
      <img
        class={computedClass()}
        src={editViewImageUrl.value}
        alt="kimage"
        onDragover={(e) => dragOver(e)}
        onDrop={(e) => drop(e)}
        onError={(e) => imgError(e)}
      />
    );
  }
});
