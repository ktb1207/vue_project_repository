import './index.scss';
import {
  defineComponent,
  VNode,
  PropType,
  toRef,
  ref,
  onMounted,
  computed,
  reactive,
  SetupContext,
  render,
  onUpdated,
  onBeforeUpdate,
  renderSlot
} from 'vue';

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
  setup(props: Props, context: SetupContext) {
    const bodyData = toRef(props, 'rowData');
    // const columnSlot = ref<Array<VNode>>([...(context.slots.default as Function)()]);
    const columnSlot: Array<VNode> = renderSlot(context.slots, 'default').children as Array<VNode>;
    const columnIndex = ref<Array<number>>([]);
    // 映射单元列位置索引
    columnSlot.forEach((item, index) => {
      columnIndex.value.push(index);
    });
    // scroll dom
    const kTablePlusScroll = ref<HTMLDivElement | null>(null);
    // 表格垂直滚动px
    const scrollTop = ref<number>(0);
    const theadStyle = computed(() => {
      const yValue = scrollTop.value;
      return {
        transform: `translate3d(0px,${yValue > 0 ? yValue + 'px' : '0px'},0px)`
      };
    });
    let dragActiveIndex = 0;
    let dragDropIndex = 0;
    // 排序-开始拖动
    const onDragStart = (activeIndex: number): void => {
      dragActiveIndex = activeIndex;
    };
    // 排序-允许放置
    const onDragOver = (e: DragEvent): void => {
      e.preventDefault();
    };
    // 交换列数据
    function exchangeArrayByIndex(inx1: number, inx2: number): void {
      const maxLength = columnIndex.value.length - 1;
      if (inx1 === inx2) {
        return;
      }
      if (inx1 > maxLength || inx2 > maxLength) {
        return;
      }
      // 最后单元列参与排序，修改新排序单元列宽度
      if (inx1 === maxLength || inx2 === maxLength) {
        console.log('最后一列参与排序了');
        // const nowEndIndex = Math.max(inx1, inx2);
        // const nowEndWidth = tableColumns.value[nowEndIndex].width;
        // const preIndex = Math.min(inx1, inx2);
        // const preWidth = tableColumns.value[preIndex].width;
        // tableColumns.value[nowEndIndex].width = preWidth;
        // tableColumns.value[preIndex].width = nowEndWidth;
      }
      columnIndex.value.splice(inx1, 1, ...columnIndex.value.splice(inx2, 1, columnIndex.value[inx1]));
    }
    // 排序放置事件
    const onDrop = (e: DragEvent, dropIndex: number): void => {
      e.preventDefault();
      dragDropIndex = dropIndex;
      exchangeArrayByIndex(dragActiveIndex, dragDropIndex);
    };
    onMounted(() => {
      // 固定表头记录表格垂直滚动
      const scrollDom = (kTablePlusScroll.value as unknown) as HTMLDivElement;
      scrollDom.addEventListener('scroll', (e) => {
        scrollTop.value = (e.target as HTMLDivElement).scrollTop;
      });
    });
    return { bodyData, context, columnIndex, kTablePlusScroll, theadStyle, onDragStart, onDragOver, onDrop };
  },
  render() {
    console.log('render update');
    const slotIndexArr = this.columnIndex;
    const columnSlot = renderSlot(this.context.slots, 'default').children as Array<VNode>;
    const createBodyTdContent = (rowItem: any) => {
      return slotIndexArr.map((num: number, index: number) => {
        const col: VNode = columnSlot[num];
        if (col.children) {
          return (
            <td
              key={index}
              style={{
                textAlign: (col.props as any).align ? (col.props as any).align : (col.type as any).props.align.default
              }}
            >
              {(col.children as any).default ? ((col.children as any).default as Function)(rowItem) : ''}
            </td>
          );
        }
        return (
          <td
            key={index}
            style={{
              textAlign: (col.props as any).align ? (col.props as any).align : (col.type as any).props.align.default
            }}
          >
            {rowItem[(col.props as any).prop ? (col.props as any).prop : '']}
          </td>
        );
      });
    };
    const headTd = slotIndexArr.map((num: number, index: number) => {
      const item: VNode = columnSlot[num];
      return (
        <td
          key={index}
          style={{
            width: (item.props as any).width ? (item.props as any).width : (item.type as any).props.width.default,
            textAlign: (item.props as any).align ? (item.props as any).align : (item.type as any).props.align.default
          }}
          draggable="true"
          onDragstart={() => this.onDragStart(index)}
          onDragover={(e) => this.onDragOver(e)}
          onDrop={(e) => this.onDrop(e, index)}
        >
          {item}
        </td>
      );
    });
    const bodyTr = this.bodyData.map((row, index) => {
      return <tr key={index}>{createBodyTdContent(row)}</tr>;
    });
    return (
      <div class="k-table-plus" ref="kTablePlusScroll">
        <table class="table-container">
          <thead style={this.theadStyle}>
            <tr class="header-tr">{headTd}</tr>
          </thead>
          <tbody class="body-tr">{bodyTr}</tbody>
        </table>
      </div>
    );
  }
});
