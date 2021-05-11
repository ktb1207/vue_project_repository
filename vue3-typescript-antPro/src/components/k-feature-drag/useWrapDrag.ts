/**
 * 外层容器拖拽
 *
 * */

function useWrapDrag(emit: (str: 'wrpDragStart' | 'wrpDragEnd', ...args: any[]) => void) {
  // 拖动开始
  const dragStart = (e: DragEvent, startTitle: string): void => {
    e.dataTransfer?.setData('wrpdrag', 'wrpdrag');

    emit('wrpDragStart', startTitle);
  };
  // 允许放置
  const allowDrop = (e: DragEvent): void => {
    if (e.dataTransfer?.types && e.dataTransfer?.types[0] === 'wrpdrag') {
      e.preventDefault();
    }
  };
  // 放置
  const dropEnd = (e: DragEvent, endtitle: string): void => {
    e.preventDefault();
    e.dataTransfer?.clearData();
    emit('wrpDragEnd', endtitle);
  };

  return {
    allowDrop,
    dragStart,
    dropEnd
  };
}

export default useWrapDrag;
