import { defineComponent, renderSlot } from 'vue';

interface Props {
  // 单元列宽
  width: string;
  // 列标题
  label?: string;
  // data key
  prop?: string;
  // 对齐
  align: string;
}

export default defineComponent({
  name: 'KColumnPlus',
  props: {
    label: {
      type: String,
      required: false,
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
    }
  },
  render() {
    const labelText = this.$props.label ? this.$props.label : '';
    return (
      <span>
        {labelText}
        <slot></slot>
      </span>
    );
  }
});
