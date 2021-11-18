// 导入组件
import { KRow, KCol, KP, KImage } from '@/admin/components/index';
import { VNode } from 'vue';

type PropSelect = Array<string> | Array<number> | string | number | boolean;
type PropValue = string | number | boolean;
type PropResize = 'text' | 'color' | 'select' | 'button';
// 组件属性定义
interface ComponentPropType {
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
interface DefaultRender {
  id: number;
  parentId: number | null;
  key: string; // 组件名称
  props: Array<ComponentPropType>; // 组件属性
  children: Array<DefaultRender> | string;
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
  preview: () => <KRow showWay="edit" showPosition="preview"></KRow>,
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
        propKey: 'showPosition',
        propValue: 'editview',
        propSelect: 'editview',
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
        resizeTitle: '垂直对齐',
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
        propKey: 'showPosition',
        propValue: 'editview',
        propSelect: 'editview',
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

registerConfig.reqister({
  label: '文本',
  key: 'KP',
  preview: () => (
    <KP showWay="edit" showPosition="preview">
      预览文本
    </KP>
  ),
  render: {
    key: 'KP',
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
        propKey: 'showPosition',
        propValue: 'editview',
        propSelect: 'editview',
        allowResize: false
      },
      {
        propKey: 'contentEdit',
        propValue: true,
        propSelect: true,
        allowResize: false
      },
      {
        propKey: 'fontAlign',
        propValue: 'left',
        propSelect: ['left', 'center', 'right'],
        allowResize: true,
        resizeTitle: '字体对齐',
        resizeFormItem: 'select'
      },
      {
        propKey: 'fontColor',
        propValue: '#333',
        propSelect: '#333',
        allowResize: true,
        resizeTitle: '字体颜色',
        resizeFormItem: 'color'
      },
      {
        propKey: 'fontSize',
        propValue: 14,
        propSelect: [12, 14, 16, 18, 20, 22, 24, 28, 32],
        allowResize: true,
        resizeTitle: '字号大小',
        resizeFormItem: 'select'
      },
      {
        propKey: 'fontWeight',
        propValue: 'normal',
        propSelect: ['100', '200', '300', '400', '500', '600', '700', '800', '900', 'normal', 'bold'],
        allowResize: true,
        resizeTitle: '字体加粗',
        resizeFormItem: 'select'
      },
      {
        propKey: 'children',
        propValue: '保存',
        propSelect: '',
        allowResize: true,
        resizeTitle: '保存文本',
        resizeFormItem: 'button'
      }
    ],
    children: '这是默认文本内容，点击可编辑'
  }
});

registerConfig.reqister({
  label: '图片',
  key: 'KImage',
  preview: () => <KImage showWay="edit" showPosition="preview"></KImage>,
  render: {
    key: 'KImage',
    id: 0,
    parentId: null,
    props: [],
    children: []
  }
});

export { registerConfig, DefaultRender, ComponentMap, ComponentPropType, PropSelect, PropValue, PropResize };
