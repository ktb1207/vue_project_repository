// 导入组件
import { KRow, KCol } from '@/admin/components/index';
import { VNode } from 'vue';

// 组件属性定义
interface ComponentPropType {
  // 组件prop name
  propKey: string;
  // prop value
  propValue: string | number;
  // prop value 可选项
  propSelect?: Array<string> | string | number;
  // 属性是否可调
  allowResize: boolean;
  // 属性调整标题
  resizeTitle?: string;
  // 属性调整控件
  resizeFormItem?: 'text' | 'color' | 'select';
}
interface DefaultRender {
  id: number;
  parentId: number | null;
  key: string; // 组件名称
  props: Array<ComponentPropType>; // 组件属性
  children: Array<DefaultRender>;
}
// 组件类型定义
interface ComponentType {
  label: string;
  key: string;
  preview: () => VNode;
  render: DefaultRender;
}

interface ComponentMap {
  [propName: string]: ComponentType;
}

/**
 * @description 物料注册
 * */
function createEditorRegister() {
  // 保存注册组件
  const componentList: Array<ComponentType> = [];
  // 组件key-commont映射
  const componentMap: ComponentMap = {};
  return {
    componentList,
    componentMap,
    reqister: (component: ComponentType) => {
      componentList.push(component);
      componentMap[component.key] = component;
    }
  };
}

const registerConfig = createEditorRegister();
// 组件注册
registerConfig.reqister({
  label: '行',
  key: 'KRow',
  preview: () => <KRow showWay="edit"></KRow>,
  render: {
    key: 'KRow',
    id: 0,
    parentId: null,
    props: [
      {
        propKey: 'nodeId',
        propValue: 0,
        propSelect: 0,
        allowResize: false
      },
      {
        propKey: 'showWay',
        propValue: 'edit',
        propSelect: ['edit', 'show'],
        allowResize: false
      },
      {
        propKey: 'align',
        propValue: 'left',
        propSelect: ['left', 'center', 'right', 'between', 'around'],
        allowResize: true,
        resizeTitle: '水平对齐',
        resizeFormItem: 'select'
      },
      {
        propKey: 'verticalAlign',
        propValue: 'stretch',
        propSelect: ['top', 'middle', 'bottom', 'stretch'],
        allowResize: true,
        resizeTitle: '水平对齐',
        resizeFormItem: 'select'
      }
    ],
    children: []
  }
});
registerConfig.reqister({
  label: '单元格',
  key: 'KCol',
  preview: () => <KCol showWay="edit" showPosition="preview"></KCol>,
  render: {
    key: 'KCol',
    id: 0,
    parentId: null,
    props: [
      {
        propKey: 'nodeId',
        propValue: 0,
        propSelect: 0,
        allowResize: false
      },
      {
        propKey: 'showWay',
        propValue: 'edit',
        propSelect: ['edit', 'show'],
        allowResize: false
      },
      {
        propKey: 'width',
        propValue: '160px',
        propSelect: '160px',
        allowResize: true,
        resizeTitle: '宽度',
        resizeFormItem: 'text'
      },
      {
        propKey: 'flexDirection',
        propValue: 'row',
        propSelect: ['row', 'col'],
        allowResize: true,
        resizeTitle: '排列方向',
        resizeFormItem: 'select'
      },
      {
        propKey: 'mainAlign',
        propValue: 'start',
        propSelect: ['start', 'center', 'end', 'between', 'around'],
        allowResize: true,
        resizeTitle: '主对齐',
        resizeFormItem: 'select'
      },
      {
        propKey: 'crossAlign',
        propValue: 'stretch',
        propSelect: ['flex-start', 'center', 'flex-end', 'stretch'],
        allowResize: true,
        resizeTitle: '副对齐',
        resizeFormItem: 'select'
      }
    ],
    children: []
  }
});

export { registerConfig, DefaultRender, ComponentMap, ComponentPropType };
