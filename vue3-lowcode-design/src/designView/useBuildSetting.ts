import { Ref } from 'vue';
import { IRegisterComponentMapType, IRenderNodeType } from '@/utils/index';
import { ISettingPropDataType, ResizeType } from '@/designSettings/index';

/**
 * @description 构建属性区数据
 *
 * @param {IRegisterComponentMapType} registerMap
 * @param {Array<IRenderNodeType>} renderData
 * @return {*}
 */
function useBuildSetting(registerMap: IRegisterComponentMapType, renderData: Ref<Array<IRenderNodeType>>) {
  function buildSettingData(vNodeId: number, reactiveData: ISettingPropDataType) {
    reactiveData.id = 0;
    reactiveData.propArr.splice(0);
    if (vNodeId > 0) {
      reactiveData.id = vNodeId;
      let inx = -1,
        vNodeKey;
      for (let i = 0, l = renderData.value.length; i < l; i++) {
        if (renderData.value[i].id === vNodeId) {
          vNodeKey = renderData.value[i].key;
          inx = i;
        }
      }
      if (inx < 0) {
        return;
      }
      const defaultComponentProp = registerMap[vNodeKey as string]?.render.props;
      const allowResizeProp = defaultComponentProp.filter((item) => {
        return item.allowResize === true;
      });
      allowResizeProp.forEach((item) => {
        const obj: ResizeType = {
          resizeFormItem: item.resizeFormItem ?? 'text',
          resizeTitle: item.resizeTitle ?? '',
          propKey: item.propKey,
          propSelect: item.propSelect ?? '',
          propValue: ''
        };
        renderData.value[inx].props.forEach((val) => {
          if (val.propKey === item.propKey) {
            obj.propValue = val.propValue;
          }
        });
        reactiveData.propArr.push(obj);
      });
    }
  }

  return {
    buildSettingData
  };
}

export { useBuildSetting };
