import { DefaultRender, ComponentMap } from '@/admin/utils/EditRegister';
import { utils } from '@/admin/utils/index';
import { ElementType } from '@/pageConfig/index';
import { Ref } from 'vue';
interface Rtype {
  materialDragStart: (e: DragEvent, c: DefaultRender) => void;
  previewDragOver: (e: DragEvent) => void;
  previewDrop: (e: DragEvent, materialMap: ComponentMap) => void;
}

/**
 * @description 物料区拖拽
 **/
function useMaterialDrag(previewData: Array<ElementType>, dragKey: Ref): Rtype {
  // 物料开始拖拽
  const materialDragStart = (e: DragEvent, c: DefaultRender) => {
    dragKey.value = c.key;
    e.dataTransfer?.setData('materialComponent', c.key);
  };
  // 拖拽经过编辑区
  const previewDragOver = (e: DragEvent) => {
    if (dragKey.value === 'KRow') {
      e.preventDefault(); // 允许放置
    }
  };
  // 编辑区放置
  const previewDrop = (e: DragEvent, materialMap: ComponentMap) => {
    const materialKey = e.dataTransfer?.getData('materialComponent') as string;
    if (materialKey === 'KRow') {
      e.preventDefault();
      const defaultComponentData = utils.deepClone(materialMap[materialKey].render);
      defaultComponentData.id = new Date().getTime();
      previewData.push(defaultComponentData);
    }
  };
  return {
    materialDragStart,
    previewDragOver,
    previewDrop
  };
}

export { useMaterialDrag };
