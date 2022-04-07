import { Ref } from 'vue';
import { IRegisterComponentMapType, IRenderNodeType } from '@/utils/index';

interface IFunReturnType {
  selectMaterial: (cKey: string, cId: number) => void;
  resizeMaterialProp: (vId: number, vKey: string, nValue: string | number) => void;
}

type EditNodeIdFn = (id: number, come: string) => void;

/**
 * @description 物料选择，构建属性设置区数据
 *
 * @export
 * @param {IRegisterComponentMapType} registerMap
 * @param {IRenderNodeType} renderData
 * @return {*}
 */
export function useSelectMaterial(
  registerMap: IRegisterComponentMapType,
  renderData: Ref<Array<IRenderNodeType>>,
  editSelectNodeId: EditNodeIdFn
): IFunReturnType {
  /**
   * @description 节点选择
   *
   * @param {string} cKey
   * @param {number} cId
   * @return {*}
   */
  function selectMaterial(cKey: string, cId: number) {
    editSelectNodeId(cId, 'click material');
  }
  /**
   * @description 属性设置
   *
   * @param {number} vId 节点id
   * @param {string} vKey 组件名称
   * @param {(string | number)} nValue 新值
   */
  function resizeMaterialProp(vId: number, vKey: string, nValue: string | number) {
    for (let i = 0, l = renderData.value.length; i < l; i++) {
      if (renderData.value[i].id === vId) {
        if (vKey === 'children') {
          // todo 文本
          renderData.value[i].children = '';
        } else {
          // 处理组件后期新增props
          const propList: Array<string> = [];
          renderData.value[i].props.forEach((item) => {
            propList.push(item.propKey);
          });
          const inPropListIndex = propList.findIndex((value) => {
            return value === vKey;
          });
          if (inPropListIndex > -1) {
            // 已有prop
            renderData.value[i].props[inPropListIndex].propValue = nValue;
          } else {
            // 后期新增props
            const addPropsItem = registerMap[renderData.value[i].key].render.props.filter((value) => {
              return value.propKey === vKey;
            });
            addPropsItem.length > 0 ? (addPropsItem[0].propValue = nValue) : null;
            renderData.value[i].props.push(...addPropsItem);
          }
        }
        break;
      }
    }
  }

  return { selectMaterial, resizeMaterialProp };
}
