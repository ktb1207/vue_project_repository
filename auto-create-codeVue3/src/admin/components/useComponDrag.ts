import { EventBus } from '@/admin/utils/Eventbus';
interface ReturnValue {
  onEditDragOver: (e: DragEvent, dragKey: string, overKey: string) => void;
  onEditDrop: (e: DragEvent, nodeId: number) => void;
  onEditChildrenTextCHange: (nodeId: number, textValue: string) => void;
}

/**
 * @description 编辑区拖拽
 */
function useEditDrag(): ReturnValue {
  const onEditDragOver = (e: DragEvent, dragKey: string, overKey: string) => {
    e.stopPropagation();
    if (overKey === 'KRow' && dragKey === 'KCol') {
      // row只允许放置单元格
      e.preventDefault();
    }
    if (overKey === 'KCol' && dragKey !== 'KCol') {
      // col 不允许在放置col
      e.preventDefault();
    }
  };
  const onEditDrop = (e: DragEvent, nodeId: number) => {
    e.stopPropagation();
    const getDragKey = e.dataTransfer?.getData('materialComponent') as string;
    EventBus.$emit('commentDrop', {
      targetId: nodeId,
      dropKey: getDragKey
    });
  };
  const onEditChildrenTextCHange = (nodeId: number, textValue: string) => {
    EventBus.$emit('commentTextEdit', {
      targetId: nodeId,
      textValue
    });
  };
  return {
    onEditDragOver,
    onEditDrop,
    onEditChildrenTextCHange
  };
}

export { useEditDrag };
