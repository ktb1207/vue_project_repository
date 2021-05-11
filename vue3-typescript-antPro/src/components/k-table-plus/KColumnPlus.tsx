import { defineComponent } from 'vue';
import KCheckbox from '../k-checkbox/KCheckbox';
interface Props {
  // 单元列宽
  width: string;
  // 列标题
  label: string;
  // data key
  prop?: string;
  // 对齐
  align?: string;
  // 全选事件
  onAllChecked?: (val: boolean) => {};
}

export default defineComponent({
  name: 'KColumnPlus',
  emits: ['AllChecked'],
  props: {
    label: {
      type: String,
      required: true,
      default: ''
    },
    prop: {
      type: String,
      required: false,
      default: ''
    },
    width: {
      type: String,
      required: true,
      default: '140px'
    },
    align: {
      type: String,
      required: false,
      default: 'left'
    },
    onAllChecked: {
      type: Function,
      required: false,
      default: (val: boolean) => {}
    }
  },
  components: {
    KCheckbox
  },
  setup(props, { emit }) {
    const allSelectChange = (status: boolean) => {
      emit('AllChecked', status);
    };
    return {
      allSelectChange
    };
  },
  render() {
    const labelText = this.$props.label ? this.$props.label : '';
    if (labelText === 'selection') {
      return <KCheckbox onCheckChange={this.allSelectChange}></KCheckbox>;
    }
    return (
      <span>
        {labelText}
        <slot></slot>
      </span>
    );
  }
});
