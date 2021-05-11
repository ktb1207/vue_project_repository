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

import KCheckbox from '../k-checkbox/KCheckbox';

interface Props {
  // 表单数据
  rowData: Array<any>;
  // 表单数据唯一标识字段
  uniqueKey: string;
  onCheckChange?: (arr: Array<any>) => {};
}

type tdInfo = {
  // 列宽
  width: string;
  // 对齐
  align: 'left' | 'center' | 'right';
};

export default defineComponent({
  name: 'KTablePlus',
  emits: ['CheckChange'],
  props: {
    rowData: {
      type: Array as PropType<Array<any>>,
      default: () => []
    },
    uniqueKey: {
      type: String,
      required: true,
      default: 'id'
    }
  },
  components: {
    KCheckbox
  },
  setup(props: Props, context: SetupContext) {
    const bodyData = toRef(props, 'rowData');
    // const columnSlot = ref<Array<VNode>>([...(context.slots.default as Function)()]);
    const columnSlot: Array<VNode> = renderSlot(context.slots, 'default').children as Array<VNode>;
    const columnIndex = ref<Array<number>>([]);
    const columnStyleArr = ref<Array<tdInfo>>([]);
    // 映射单元列位置索引
    columnSlot.forEach((item, index) => {
      columnIndex.value.push(index);
      const styleObj: tdInfo = {
        width: (item.props as any).width ? (item.props as any).width : (item.type as any).props.width.default,
        align: (item.props as any).align ? (item.props as any).align : (item.type as any).props.align.default
      };
      columnStyleArr.value.push(styleObj);
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
    // 列排序-开始拖动
    const onDragStart = (activeIndex: number): void => {
      dragActiveIndex = activeIndex;
    };
    // 列排序-允许放置
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
    // 列排序-放置事件
    const onDrop = (e: DragEvent, dropIndex: number): void => {
      e.preventDefault();
      dragDropIndex = dropIndex;
      exchangeArrayByIndex(dragActiveIndex, dragDropIndex);
    };
    type resizeInfo = {
      // 调整列索引
      nowResizeTdIndex: number;
      // 开始x坐标
      startPoint: number;
      // 开始相对table左侧距离
      relativeTableLeft: number;
      // 开始td宽度
      originalTdWidth: number;
      // td左侧坐标
      originalTdLeftPoint: number;
      // 调整td最终宽度
      endReviseTdWidth: number;
      // td左边相对table位置
      tdLeftRelativeTable: number;
    };
    const resizeState = ref<resizeInfo>({
      nowResizeTdIndex: 0,
      startPoint: 0,
      relativeTableLeft: 0,
      originalTdWidth: 0,
      originalTdLeftPoint: 0,
      endReviseTdWidth: 0,
      tdLeftRelativeTable: 0
    });
    const resizeLineLeft = ref<number>(-2000);
    // 列调整
    const handelResizeMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      console.log('列宽调整移动...');
      // 鼠标移动point与开始point差值
      const deltaLeft = e.clientX - resizeState.value.startPoint;
      console.log('移动差值：' + deltaLeft);
      let moveLineEndPoint = 0;
      if (resizeState.value.originalTdWidth + deltaLeft >= 50) {
        moveLineEndPoint = resizeState.value.relativeTableLeft + deltaLeft;
      } else {
        console.log('小于50了');
        moveLineEndPoint = resizeState.value.tdLeftRelativeTable + 50;
      }
      // 标注线移动
      resizeLineLeft.value = moveLineEndPoint;
      // 最小宽度限制50
      // const minLeft = resizeState.value.originalTdLeftPoint + 50;
      // 实时移动差值
      // const proxyLeft = resizeState.value.relativeTableLeft + deltaLeft;
      // 标注线最终位置
      // const moveLineEndPoint = Math.max(minLeft, proxyLeft);
      // 标注线开始到结束位置差值,+ 变大 - 变小
      const moveLineDiffByEndAndStart = moveLineEndPoint - resizeState.value.relativeTableLeft;
      resizeState.value.endReviseTdWidth = resizeState.value.originalTdWidth + moveLineDiffByEndAndStart;
    };
    const handelResizeMouseUp = () => {
      resizeLineLeft.value = -2000;
      const findOriginalIndex = columnIndex.value[resizeState.value.nowResizeTdIndex];
      columnStyleArr.value[findOriginalIndex].width = resizeState.value.endReviseTdWidth + 'px';
      document.removeEventListener('mousemove', handelResizeMouseMove);
      document.removeEventListener('mouseup', handelResizeMouseUp);
    };
    // 列宽调整-开始
    const handleResizeMouseDown = (e: MouseEvent, activeIndex: number): void => {
      e.stopPropagation();
      console.log('列宽调整开始..');
      const target = e.target as HTMLSpanElement;
      const parentNode = target.parentNode as HTMLTableColElement;
      const columnRect = parentNode.getBoundingClientRect();
      const tableRef = kTablePlusScroll.value as HTMLDivElement;
      const tableLeft = tableRef.getBoundingClientRect().left;
      resizeState.value = {
        nowResizeTdIndex: activeIndex,
        startPoint: e.clientX,
        relativeTableLeft: columnRect.right - tableLeft,
        originalTdWidth: columnRect.right - columnRect.left,
        originalTdLeftPoint: columnRect.left,
        endReviseTdWidth: columnRect.right - columnRect.left,
        tdLeftRelativeTable: columnRect.left - tableLeft
      };
      console.log('td原始宽度：' + resizeState.value.originalTdWidth);
      console.log('td右边到视窗距离:' + columnRect.right);
      console.log('table左边到视窗距离:' + tableLeft);
      resizeLineLeft.value = resizeState.value.relativeTableLeft;
      document.addEventListener('mousemove', handelResizeMouseMove);
      document.addEventListener('mouseup', handelResizeMouseUp);
    };
    // 选中状态
    const columnCheckStatus = ref<'checked' | 'unChecked' | 'halfChecked'>('unChecked');
    // 唯一数据标识符
    const uniqueDataKey = toRef(props, 'uniqueKey');
    const nowCheckArr = reactive<Array<any>>([]);
    // 选中所有切换
    const checkAll = (val: boolean) => {
      console.log('全选事件：' + val);
      // 全部清空
      nowCheckArr.splice(0, nowCheckArr.length);
      if (val) {
        bodyData.value.forEach((item) => {
          nowCheckArr.push(item[uniqueDataKey.value]);
        });
      }
      context.emit('CheckChange', nowCheckArr);
    };
    // 单一行选中
    const preCheck = (status: boolean, item: any) => {
      if (status) {
        if (!nowCheckArr.includes(item[uniqueDataKey.value])) {
          // 添加
          nowCheckArr.push(item[uniqueDataKey.value]);
        }
      } else {
        const findIndex = nowCheckArr.findIndex((value) => {
          return value === item[uniqueDataKey.value];
        });
        if (findIndex > -1) {
          //删除
          nowCheckArr.splice(findIndex, 1);
        }
      }
      if (nowCheckArr.length === 0) {
        columnCheckStatus.value = 'unChecked';
      } else if (nowCheckArr.length === bodyData.value.length) {
        columnCheckStatus.value = 'checked';
      } else {
        columnCheckStatus.value = 'halfChecked';
      }
      context.emit('CheckChange', nowCheckArr);
    };
    onMounted(() => {
      // 固定表头记录表格垂直滚动
      const scrollDom = (kTablePlusScroll.value as unknown) as HTMLDivElement;
      scrollDom.addEventListener('scroll', (e) => {
        scrollTop.value = (e.target as HTMLDivElement).scrollTop;
      });
    });
    return {
      bodyData,
      context,
      columnIndex,
      columnStyleArr,
      kTablePlusScroll,
      theadStyle,
      resizeLineLeft,
      onDragStart,
      onDragOver,
      onDrop,
      handleResizeMouseDown,
      columnCheckStatus,
      nowCheckArr,
      uniqueDataKey,
      checkAll,
      preCheck
    };
  },
  render() {
    console.log('render update');
    const slotIndexArr = this.columnIndex;
    const checkArr = this.nowCheckArr;
    const columnSlot = renderSlot(this.context.slots, 'default').children as Array<VNode>;

    const renderBodyContentOrCheckbox = (item: any, props: any) => {
      if (props.label === 'selection') {
        const checkAllStr = checkArr.includes(item[this.uniqueDataKey]) ? 'checked' : 'unChecked';
        return (
          <KCheckbox checkStatus={checkAllStr} onCheckChange={(val: boolean) => this.preCheck(val, item)}></KCheckbox>
        );
      }
      return item[props.prop ? props.prop : ''];
    };
    // 构造body td内容
    const createBodyTdContent = (rowItem: any) => {
      return slotIndexArr.map((num: number, index: number) => {
        const col: VNode = columnSlot[num];
        if (col.children) {
          return (
            <td
              key={index}
              style={{
                textAlign: this.columnStyleArr[num].align
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
            {/* {rowItem[(col.props as any).prop ? (col.props as any).prop : '']} */}
            {renderBodyContentOrCheckbox(rowItem, col.props)}
          </td>
        );
      });
    };
    // 构造head td
    const headTd = slotIndexArr.map((num: number, index: number) => {
      const item: VNode = columnSlot[num];
      return (
        <td
          key={index}
          style={{
            width: this.columnStyleArr[num].width,
            textAlign: this.columnStyleArr[num].align
          }}
          draggable="true"
          onDragstart={() => this.onDragStart(index)}
          onDragover={(e) => this.onDragOver(e)}
          onDrop={(e) => this.onDrop(e, index)}
        >
          {
            <item
              disabled={this.bodyData.length === 0}
              checkStatus={this.columnCheckStatus}
              onAllChecked={this.checkAll}
            />
          }
          {index < slotIndexArr.length - 1 && (
            <span class="resize-span" onMousedown={(e) => this.handleResizeMouseDown(e, index)}></span>
          )}
        </td>
      );
    });
    // 构造body tr
    const bodyTr = this.bodyData.map((row, index) => {
      return (
        <>
          <tr class="body-tr" key={index}>
            {createBodyTdContent(row)}
          </tr>
        </>
      );
    });
    const dragResieLineLeft = this.resizeLineLeft + 'px';
    return (
      <div class="k-table-plus" ref="kTablePlusScroll">
        <table class="table-container">
          <thead style={this.theadStyle}>
            <tr class="header-tr">{headTd}</tr>
          </thead>
          <tbody>{bodyTr}</tbody>
        </table>
        {/* 拖拽线 */}
        <div class="resize-line" style={{ left: dragResieLineLeft }}></div>
        {this.bodyData.length === 0 && <div class="no-data-tip">暂无数据</div>}
      </div>
    );
  }
});
