import { useComponentRegister } from './useComponentRegister';
import { createVNode } from 'vue';

const { register, componentRegisterList, componentRegisterMap } = useComponentRegister();

export function useMaterialRegister() {
  //KRow
  register({
    label: '布局',
    key: 'KRow',
    isContainer: true,
    isShowAtMaterialList: true,
    preview: () => <span>容器</span>,
    render: {
      key: 'KRow',
      id: 0,
      parentId: null,
      props: [
        {
          propKey: 'nodeId',
          propValue: 0,
          allowResize: false
        },
        {
          propKey: 'renderWay',
          propValue: 'edit',
          allowResize: false
        },
        {
          propKey: 'horizontalAlign',
          propValue: 'left',
          allowResize: true,
          propSelect: ['left', 'center', 'right', 'between', 'around'],
          resizeTitle: '水平对齐',
          resizeFormItem: 'select'
        },
        {
          propKey: 'verticalAlign',
          propValue: 'stretch',
          allowResize: true,
          propSelect: ['top', 'middle', 'bottom', 'stretch'],
          resizeTitle: '垂直对齐',
          resizeFormItem: 'select'
        }
      ],
      children: []
    }
  });
  // KCol
  register({
    label: '列',
    key: 'KCol',
    isContainer: true,
    isShowAtMaterialList: false,
    preview: () => <span>列-容器</span>,
    render: {
      key: 'KCol',
      id: 0,
      parentId: null,
      props: [
        {
          propKey: 'nodeId',
          propValue: 0,
          allowResize: false
        },
        {
          propKey: 'renderWay',
          propValue: 'edit',
          allowResize: false
        },
        {
          propKey: 'width',
          propValue: '1',
          allowResize: true,
          propSelect: '1',
          resizeTitle: '宽度',
          resizeFormItem: 'text'
        },
        {
          propKey: 'flexDirection',
          propValue: 'row',
          allowResize: true,
          propSelect: ['row', 'col'],
          resizeTitle: 'flex方向',
          resizeFormItem: 'select'
        },
        {
          propKey: 'mainAlign',
          propValue: 'start',
          allowResize: true,
          propSelect: ['start', 'center', 'end', 'between', 'around'],
          resizeTitle: '主轴对齐',
          resizeFormItem: 'select'
        },
        {
          propKey: 'crossAlign',
          propValue: 'stretch',
          allowResize: true,
          propSelect: ['flex-start', 'center', 'flex-end', 'stretch'],
          resizeTitle: '交叉轴对齐',
          resizeFormItem: 'select'
        }
      ],
      children: []
      // placeHolder: createVNode(
      //   'div',
      //   {
      //     style: 'flex:1; text-align:center;line-height:48px; border:1px solid #e0e0e0;background-color: #f1f1f1;'
      //   },
      //   ['拖拽组件到这里']
      // )
    }
  });
  // KButton
  register({
    label: '原子',
    key: 'KButton',
    isContainer: false,
    isShowAtMaterialList: true,
    preview: () => <span>按钮</span>,
    render: {
      key: 'KButton',
      id: 0,
      parentId: null,
      props: [
        {
          propKey: 'nodeId',
          propValue: 0,
          allowResize: false
        },
        {
          propKey: 'renderWay',
          propValue: 'edit',
          allowResize: false
        },
        {
          propKey: 'size',
          propValue: 'default',
          allowResize: true,
          propSelect: ['large', 'default', 'small'],
          resizeTitle: '尺寸',
          resizeFormItem: 'select'
        },
        {
          propKey: 'type',
          propValue: 'default',
          allowResize: true,
          propSelect: ['default', 'primary', 'success', 'warning', 'danger', 'info', 'text'],
          resizeTitle: '类型',
          resizeFormItem: 'select'
        },
        {
          propKey: 'text',
          propValue: 'button',
          allowResize: true,
          resizeTitle: '文本',
          resizeFormItem: 'text'
        }
      ],
      methodsProps: [
        {
          methodsName: 'onClick',
          methodsValue: undefined
        }
      ],
      children: []
    }
  });

  register({
    label: '原子',
    key: 'KInput',
    isContainer: false,
    isShowAtMaterialList: true,
    preview: () => <span>input</span>,
    render: {
      key: 'KInput',
      id: 0,
      parentId: null,
      props: [
        {
          propKey: 'nodeId',
          propValue: 0,
          allowResize: false
        },
        {
          propKey: 'renderWay',
          propValue: 'edit',
          allowResize: false
        },
        {
          propKey: 'labelText',
          propValue: 'label',
          allowResize: true,
          resizeTitle: 'label',
          resizeFormItem: 'text'
        },
        {
          propKey: 'labelWidth',
          propValue: '140px',
          allowResize: true,
          resizeTitle: 'label宽',
          resizeFormItem: 'text'
        },
        {
          propKey: 'inputSize',
          propValue: 'default',
          allowResize: true,
          resizeTitle: '尺寸',
          resizeFormItem: 'select',
          propSelect: ['default', 'large', 'small']
        }
      ],
      methodsProps: [
        {
          methodsName: 'onFocus',
          methodsValue: undefined,
          methodParams: [
            {
              pname: 'e',
              ptype: 'FocusEvent'
            }
          ]
        },
        {
          methodsName: 'onBlur',
          methodsValue: undefined,
          methodParams: [
            {
              pname: 'e',
              ptype: 'FocusEvent'
            }
          ]
        },
        {
          methodsName: 'onInput',
          methodsValue: undefined,
          methodParams: [
            {
              pname: 'value',
              ptype: 'string | number'
            }
          ]
        }
      ],
      children: []
    }
  });

  return {
    componentRegisterList,
    componentRegisterMap
  };
}
