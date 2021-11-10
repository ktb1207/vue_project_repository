import { defineComponent, PropType, inject, ref, toRef, Ref, SetupContext } from 'vue';
import { ShowWay, ShowPosition, FontWeight } from '../componType';

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
    const nowId = toRef(props, 'nodeId');
    const computedClass = (): string => {
      const editClass = props.showWay === 'edit' ? ' is-edit' : '';
      const isPreview = props.showPosition === 'preview' ? ' is-preview' : ' is-editview';
      const isActive = editActiveId?.value === nowId.value ? ' ' + 'edit-active' : '';
      return 'k-p' + isPreview + editClass + isActive;
    };
    const fcolor = toRef(props, 'fontColor');
    const fsize = toRef(props, 'fontSize');
    const fweight = toRef(props, 'fontWeight');
    return () => (
      <p
        class={computedClass()}
        style={{ color: fcolor.value, fontSize: fsize.value + 'px', fontWeight: fweight.value }}
        contenteditable={props.contentEdit}
      >
        {ctx.slots.default ? ctx.slots.default() : ''}
      </p>
    );
  }
});
