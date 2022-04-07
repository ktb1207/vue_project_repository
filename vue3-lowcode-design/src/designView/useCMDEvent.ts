import { Ref } from 'vue';
import { IRenderNodeType, deepClone, EventBus } from '@/utils/index';
type EditNodeIdFn = (id: number, come: string) => void;

function useCMDEvent(editorData: Ref<Array<IRenderNodeType>>, editSelectNodeId: EditNodeIdFn) {
  function copyData(copyId: number) {
    for (let i = 0, l = editorData.value.length; i < l; i++) {
      if (editorData.value[i].id === copyId) {
        const copyData = deepClone(editorData.value[i]);
        const buildId = new Date().getTime();
        copyData.id = buildId;
        editorData.value.splice(i + 1, 0, copyData);
        editSelectNodeId(buildId, 'add');
        // EventBus.$emit('addNode', copyData);
        break;
      }
    }
  }

  return {
    copyData
  };
}

export { useCMDEvent };
