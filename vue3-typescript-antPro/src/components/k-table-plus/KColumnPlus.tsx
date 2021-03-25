import { defineComponent } from 'vue';

interface Props {
  label?: string;
  prop?: string;
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
    }
  },
  render() {
    const labelText = this.$props.label ? this.$props.label : '';
    return <span>{labelText}</span>;
  }
});
