// 导入组件
import { KRow, KCol } from '@/admin/components/index';
import { VNode } from 'vue';
// 组件类型定义
interface ComponentType {
  label: string;
  key: string;
  preview: () => VNode;
  render: DefaultRender;
}
// 组件属性定义
interface ComponentPropType {
  propKey: string; // 组件prop name
  propValue: string | number; // prop value
  propSelect?: Array<string> | string | number; // prop value 可选项
}

interface ComponentMap {
  [propName: string]: ComponentType;
}

interface DefaultRender {
  id: number;
  parentId: number | null;
  key: string; // 组件名称
  props: Array<ComponentPropType>; // 组件属性
  children: Array<DefaultRender>;
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
        propSelect: 0
      },
      {
        propKey: 'showWay',
        propValue: 'edit',
        propSelect: ['edit', 'show']
      },
      {
        propKey: 'align',
        propValue: 'left',
        propSelect: ['left', 'center', 'right', 'between', 'around']
      },
      {
        propKey: 'verticalAlign',
        propValue: 'stretch',
        propSelect: ['top', 'middle', 'bottom', 'stretch']
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
        propSelect: 0
      },
      {
        propKey: 'showWay',
        propValue: 'edit',
        propSelect: ['edit', 'show']
      },
      {
        propKey: 'width',
        propValue: '160px',
        propSelect: '160px'
      },
      {
        propKey: 'flexDirection',
        propValue: 'row',
        propSelect: ['row', 'col']
      },
      {
        propKey: 'mainAlign',
        propValue: 'start',
        propSelect: ['start', 'center', 'end', 'between', 'around']
      },
      {
        propKey: 'crossAlign',
        propValue: 'stretch',
        propSelect: ['flex-start', 'center', 'flex-end', 'stretch']
      }
    ],
    children: []
  }
});

export { registerConfig, DefaultRender, ComponentMap };
