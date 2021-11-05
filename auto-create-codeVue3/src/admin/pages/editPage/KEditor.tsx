import { defineComponent, createVNode, resolveComponent, PropType, toRef, VNode, ComponentOptions } from 'vue';
import { ElementType } from '@/pageConfig/index';
import { utils } from '@/admin/utils/index';
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
    }
  },
  setup(props) {
    const configData = toRef(props, 'editData');
    /**
     * @description 点击选中
     * */
    function clickSelection(e: MouseEvent, componentName: string, componentId: number) {
      console.log(componentName);
      console.log(componentId);
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
              return arr[i].children.length > 0 ? recurrenceBuildVnode(arr[i].children) : [];
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
