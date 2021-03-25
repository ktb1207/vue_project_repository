import './index.scss';
import { defineComponent, VNode, PropType, toRef, isVNode } from 'vue';

interface Props {
  rowData: Array<any>;
}

export default defineComponent({
  name: 'KTablePlus',
  props: {
    rowData: {
      type: Array as PropType<Array<any>>,
      default: () => []
    }
  },
  setup(props: Props) {
    const bodyData = toRef(props, 'rowData');
    return { bodyData };
  },
  render() {
    const slot = (this.$slots.default as Function)();
    console.log(slot);
    const createBodyTdContent = (rowItem: any) => {
      return slot.map((col: VNode, index: number) => {
        if (col.children) {
          return <td key={index}>{((col.children as any).default as Function)(rowItem)}</td>;
        }
        return <td key={index}>{rowItem[(col.props as any).prop ? (col.props as any).prop : '']}</td>;
      });
    };
    const headTd = slot.map((item: VNode, index: number) => <td key={index}>{item}</td>);
    const bodyTr = this.bodyData.map((row, index) => {
      return <tr key={index}>{createBodyTdContent(row)}</tr>;
    });
    return (
      <div class="k-table-plus">
        <table class="table-container">
          <thead>
            <th class="header-tr">{headTd}</th>
          </thead>
          <tbody class="body-tr">{bodyTr}</tbody>
        </table>
      </div>
    );
  }
});
