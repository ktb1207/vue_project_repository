import { defineComponent, createVNode, resolveComponent, PropType, toRef, VNode, ComponentOptions } from 'vue';
import { ElementType } from '@/pageConfig/index';
import { utils, registerConfig, ComponentPropType } from '@/admin/utils/index';
interface ComponentProps {
  [propsName: string]: any;
}
export default defineComponent({
  name: 'KEditor',
  props: {
    editData: {
      type: Array as PropType<Array<ElementType>>,
      default: () => [],
      required: false
    },
    onComponentClick: {
      type: Function as PropType<(id: number, resizeProp: Array<ComponentPropType>) => void>,
      required: false
    }
  },
  setup(props) {
    const configData = toRef(props, 'editData');
    /**
     * @description 依据组件name找出组件可调整属性
     * */
    function findComponentSettingProps(componentName: string): Array<ComponentPropType> {
      const allProps = registerConfig.componentMap[componentName].render.props;
      const resizeProps = allProps.filter((item) => {
        return item.allowResize === true;
      });
      return resizeProps;
    }
    /**
     * @description 依据组件id找出组件属性对应值
     * */
    function findComponentNowPropValue(componentId: number): Array<ComponentPropType> {
      const propArr: Array<ComponentPropType> = [];
      configData.value.forEach((item) => {
        if (item.id === componentId) {
          propArr.push(...item.props);
        }
      });
      return propArr;
    }
    /**
     * @description 点击选中
     * @param {componentName} 组件名称
     * @param {componentId} 当前组件id
     * */
    function clickSelection(e: MouseEvent, componentName: string, componentId: number) {
      const getResizeProps = findComponentSettingProps(componentName);
      // const getResizeValue = findComponentNowPropValue(componentId);
      // console.log(getResizeValue);
      props.onComponentClick && props.onComponentClick(componentId, getResizeProps);
      e.stopPropagation();
    }
    /**
     * 依据dom树数据递归构建vnode
     * */
    const recurrenceBuildVnode = (arr: Array<ElementType>): Array<VNode> => {
      const vnodeList: Array<VNode> = [];
      for (let i = 0, l = arr.length; i < l; i++) {
        const componentName = resolveComponent(arr[i].key);
        const componentProp: ComponentProps = {};
        arr[i].props.forEach((p) => {
          if (p.propKey === 'nodeId') {
            componentProp['nodeId'] = arr[i].id;
          } else {
            componentProp[p.propKey] = p.propValue;
          }
        });
        const linePie = createVNode(
          componentName,
          {
            onClick: (e: MouseEvent) => clickSelection(e, (componentName as ComponentOptions).name ?? '', arr[i].id),
            ...componentProp
          },
          {
            default() {
              if (typeof arr[i].children === 'string') {
                return arr[i].children;
              }
              return arr[i].children.length > 0 ? recurrenceBuildVnode(arr[i].children as Array<ElementType>) : [];
            }
          }
        );
        vnodeList.push(linePie);
      }
      return vnodeList;
    };
    /**
     * 构建dom树数据
     * */
    const createVnodeByData = (arr: Array<ElementType>): Array<VNode> => {
      const vnodeTreeData = utils.buildTreeDataByLevelData(arr);
      const getVnodeTree = recurrenceBuildVnode(vnodeTreeData);
      return getVnodeTree;
    };
    /**
     * 渲染vnode
     * */
    const renderVnode = () => {
      const vnodeList: Array<VNode> = [];
      const vnodeArr = createVnodeByData(utils.deepClone(configData.value));
      vnodeArr.forEach((vn) => vnodeList.push(vn));
      return vnodeList;
    };
    return () => <div>{renderVnode().map((vn) => vn)}</div>;
  }
});
