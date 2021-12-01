import { defineComponent, PropType, inject, Ref, ref, toRef, watch } from 'vue';
import './style.scss';
import { ShowWay, ShowPosition } from '../componType';
import { useEditDrag } from '../useComponDrag';
import sysApi from '@/admin/api/index';
import kPreviewImage from './k_img_preview.png';
import kEditViewImage from './k_img_editview.png';

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
      default: 'editview',
      required: false
    },
    imageName: {
      type: String,
      default: 'default.png',
      required: false
    },
    imageWidth: {
      type: [String, Number],
      default: 'auto',
      required: false
    },
    imageHeight: {
      type: [String, Number],
      default: 'auto',
      required: false
    }
  },
  setup(props) {
    const editActiveId = inject<Ref>('editId', ref(999999));
    const nowNodeId = toRef(props, 'nodeId');
    const showMethod = toRef(props, 'showWay');
    const showLocation = toRef(props, 'showPosition');
    const overKey = inject<Ref>('dragKey', ref(''));
    const widthStyle = toRef(props, 'imageWidth');
    const heightStyle = toRef(props, 'imageHeight');
    const { onEditDragOver, onEditDrop } = useEditDrag();
    const computedClass = (): string => {
      const editClass = props.showWay === 'edit' ? ' is-edit' : '';
      const isPreview = props.showPosition === 'preview' ? ' is-preview' : ' is-editview';
      const isActive = editActiveId?.value === nowNodeId.value ? ' ' + 'edit-active' : '';
      return 'k-image' + isPreview + editClass + isActive;
    };
    function getBase64Image(img: HTMLImageElement) {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, img.width, img.height);
      const dataUrl = canvas.toDataURL('image/jpg');
      return dataUrl;
    }
    async function getImageByName(name: string) {
      return new Promise((resolve, reject) => {
        let urlData = '';
        import('@/assets/images/' + name).then((res) => {
          const img = document.createElement('img');
          img.src = res.default;
          img.onload = function () {
            urlData = getBase64Image(img);
            resolve(urlData);
          };
          img.onerror = function () {
            reject('img load error');
          };
        });
      });
    }

    const imagePropName = toRef(props, 'imageName');
    async function backReallyImage() {
      const st = await getImageByName(imagePropName.value).then((res) => {
        return res;
      });
      return st;
    }
    const computedImageUrl = ref('');
    // 区分预览去与编辑区及预览
    if (showLocation.value === 'preview') {
      // 组件预览区显示
      computedImageUrl.value = kPreviewImage;
    } else {
      // 画布编辑区及预览页面
      const result = backReallyImage();
      result.then((res) => {
        computedImageUrl.value = res as string;
      });
    }
    const editViewImageUrl = ref(computedImageUrl.value);
    // 画布编辑修改图片名字
    watch(imagePropName, (newVal) => {
      if (newVal) {
        sysApi.getImageBase({ imageName: newVal }).then((res) => {
          if (res.code === 200) {
            editViewImageUrl.value = res.data.dataSrc;
          }
        });
      }
    });
    watch(computedImageUrl, (val) => {
      editViewImageUrl.value = val;
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
    // 图片加载错误，指向默认图片
    const imgError = () => {
      editViewImageUrl.value = kEditViewImage;
    };
    return () => (
      <img
        class={computedClass()}
        style={{ width: widthStyle.value, height: heightStyle.value }}
        src={editViewImageUrl.value}
        alt="kimage"
        onDragover={(e) => dragOver(e)}
        onDrop={(e) => drop(e)}
        onError={() => imgError()}
      />
    );
  }
});
