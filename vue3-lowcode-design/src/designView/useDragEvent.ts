import { Ref } from 'vue';
import { IRenderNodeType, IRegisterComponentMapType, deepClone, EventBus } from '@/utils/index';

interface IReturnType {
  materialDragStart: (e: DragEvent, render: IRenderNodeType, renderId: number) => void;
  materialDragOver: (e: DragEvent) => void;
  materialDragDrop: (e: DragEvent, allRegisterMaterialMap: IRegisterComponentMapType) => void;
}

type EditNodeIdFn = (id: number, come: string) => void;

function useDragEvent(
  editDta: Ref<Array<IRenderNodeType>>,
  dragKey: Ref<string>,
  editSelectNodeId: EditNodeIdFn
): IReturnType {
  /**
   * @description 物料拖拽
   * @param {e} DragEvent
   * @param {render} 渲染vnode
   * @param {renderId} vnodeId
   * */
  const materialDragStart = (e: DragEvent, render: IRenderNodeType, renderId: number) => {
    dragKey.value = render.key;
    e.dataTransfer?.setData('dragKey', render.key);
    if (renderId === 0) {
      console.log('物料区拖拽');
      e.dataTransfer?.setData('dragStartArea', 'material');
    } else {
      console.log('画布区拖拽');
      e.dataTransfer?.setData('dragStartArea', 'canvas');
    }
  };
  /**
   * @description 拖拽经过
   *
   * @param {DragEvent} e
   */
  const materialDragOver = (e: DragEvent) => {
    const overElement = e.target as HTMLElement;
    if (overElement.getAttribute('data-drop') !== 'true') {
      // 禁止放置
      e.stopPropagation();
    } else {
      // 允许放置
      e.preventDefault();
    }
  };
  /**
   * @description 拖拽放置
   *
   * @param {DragEvent} e
   */
  const materialDragDrop = (e: DragEvent, allRegisterMaterialMap: IRegisterComponentMapType) => {
    const dropElement = e.target as HTMLElement;
    const dropTargetNodeId = dropElement.getAttribute('data-node-id');
    const dragKey = e.dataTransfer?.getData('dragKey') as string;
    const dragStartArea = e.dataTransfer?.getData('dragStartArea') as string;

    if (dragStartArea === 'material') {
      // 新增
      const renderDefaultVnode = deepClone(allRegisterMaterialMap[dragKey].render);
      renderDefaultVnode.id = new Date().getTime();
      if (dropTargetNodeId === 'null') {
        // 放置根容器
      } else {
        // 嵌套
        renderDefaultVnode.parentId = Number(dropTargetNodeId as string);
      }
      editDta.value.push(renderDefaultVnode);
      if (dragKey === 'KRow') {
        const defaultAddKColRender = deepClone(allRegisterMaterialMap['KCol'].render);
        defaultAddKColRender.id = new Date().getTime() + 1;
        defaultAddKColRender.parentId = renderDefaultVnode.id;
        editDta.value.push(defaultAddKColRender);
      }
      EventBus.$emit('addNode', editDta.value[editDta.value.length - 1]);
      editSelectNodeId(editDta.value[editDta.value.length - 1].id, 'drop');
    } else {
      // 调整
      console.log('拖拽调整');
    }
  };

  return {
    materialDragStart,
    materialDragOver,
    materialDragDrop
  };
}

export { useDragEvent };
