import { VNode } from 'vue';
import { isHasProperty } from './index';

/**
 *@description 物料注册方法
 *
 */

type PropSelect = Array<string> | Array<number> | string | number | boolean;
type PropValue = string | number | boolean;
type PropResize = 'text' | 'color' | 'select' | 'button';

interface IComponentPropType {
  // 组件prop name
  propKey: string;
  // prop value
  propValue: PropValue;
  // prop value 可选项
  propSelect?: PropSelect;
  // 属性是否可调
  allowResize: boolean;
  // 属性调整标题
  resizeTitle?: string;
  // 属性调整控件
  resizeFormItem?: PropResize;
}

interface IComponentMethodsProp {
  methodsName: string;
  methodsValue: string | undefined;
  methodParams?: {
    pname: string;
    ptype:
      | 'MouseEvent'
      | 'FocusEvent'
      | 'string'
      | 'number'
      | 'boolean'
      | 'string | number'
      | 'Array<string>'
      | 'Array<number>';
  }[];
}

interface IRenderNodeType {
  // vnode id
  id: number;
  // vnode 父id
  parentId: number | null;
  // 组件名称
  key: string;
  // 组件属性
  props: Array<IComponentPropType>;
  // children
  children: Array<IRenderNodeType> | string | VNode;
  // 事件属性
  methodsProps?: Array<IComponentMethodsProp>;
  // 提示
  placeHolder?: VNode;
}

// 注册组件接口定义
interface IRegisterComponentType {
  // 物料描述
  label: string;
  // 组件名称
  key: string;
  // 是否为容器
  isContainer: boolean;
  // 是否显示在物料区
  isShowAtMaterialList: boolean;
  // 预览展示
  preview: () => VNode;
  // 默认渲染
  render: IRenderNodeType;
}

interface IRegisterComponentMapType {
  [propName: string]: IRegisterComponentType;
}
function useComponentRegister() {
  const componentRegisterList: Array<IRegisterComponentType> = [];
  const componentRegisterMap: IRegisterComponentMapType = {};
  return {
    componentRegisterList,
    componentRegisterMap,
    register: (component: IRegisterComponentType) => {
      if (isHasProperty(componentRegisterMap, component.key)) {
        console.log('注册物料重复，已忽略');
        return;
      }
      componentRegisterList.push(component);
      componentRegisterMap[component.key] = component;
    }
  };
}

export {
  useComponentRegister,
  IRegisterComponentType,
  IRenderNodeType,
  IRegisterComponentMapType,
  IComponentPropType,
  PropSelect,
  PropValue,
  PropResize
};
