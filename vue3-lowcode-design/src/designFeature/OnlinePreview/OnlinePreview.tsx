import { defineComponent, PropType, VNode, toRef, createVNode, resolveComponent, inject } from 'vue';
import { IRenderNodeType, deepClone, buildTreeDataByLevelData, IRegisterComponentMapType } from '@/utils/index';
import style from './style.module.scss';

interface ComponentProps {
  [propsName: string]: any;
}

export default defineComponent({
  name: 'OnlinePreview',
  props: {
    canvasData: {
      type: Array as PropType<Array<IRenderNodeType>>,
      default: () => [],
      required: false
    },
    onClose: {
      type: Function as PropType<() => void>
    }
  },
  setup(props) {
    const editorData = toRef(props, 'canvasData');
    const materialMap = inject<IRegisterComponentMapType>('materialMap');
    const close = () => {
      props.onClose && props.onClose();
    };

    /**
     * 依据dom树数据递归构建vnode
     * */
    const recurrenceBuildVnode = (arr: Array<IRenderNodeType>): Array<VNode> => {
      const vnodeList: Array<VNode> = [];
      for (let i = 0, l = arr.length; i < l; i++) {
        const componentName = resolveComponent(arr[i].key);
        const componentProp: ComponentProps = {};
        const renderProps = arr[i].props.filter((item) => {
          return item.allowResize === true;
        });
        renderProps.forEach((p) => {
          componentProp[p.propKey] = p.propValue;
        });

        const linePie = createVNode(
          componentName,
          {
            ...componentProp
          },
          {
            default() {
              if (
                Array.isArray(arr[i].children) &&
                (arr[i].children as Array<IRenderNodeType>).length === 0 &&
                arr[i].placeHolder
              ) {
                // placeHolder 不影响拖拽事件
                return createVNode(arr[i].placeHolder as VNode, {
                  'data-node-id': arr[i].id,
                  'data-drop': 'true'
                });
              }
              if (typeof arr[i].children === 'string') {
                return arr[i].children;
              } else if (Array.isArray(arr[i].children)) {
                return (arr[i].children as Array<IRenderNodeType>).length > 0
                  ? recurrenceBuildVnode(arr[i].children as Array<IRenderNodeType>)
                  : [];
              } else {
                return arr[i].children;
              }
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
    const createVnodeByData = (arr: Array<IRenderNodeType>): Array<VNode> => {
      const vnodeTreeData = buildTreeDataByLevelData(arr);
      const getVnodeTree = recurrenceBuildVnode(vnodeTreeData);
      return getVnodeTree;
    };
    /**
     * 渲染vnode
     * */
    const renderVnode = () => {
      const vnodeList: Array<VNode> = [];
      const placeHolder = <span class={style.placeholder}>无预览数据</span>;
      if (editorData.value.length > 0) {
        const vnodeArr = createVnodeByData(deepClone(editorData.value));
        vnodeArr.forEach((vn) => vnodeList.push(vn));
        return vnodeList;
      } else {
        vnodeList.push(placeHolder);
        return vnodeList;
      }
    };
    return () => (
      <div class={style['preview-wrp']}>
        <header>
          <button onClick={close}>关闭预览</button>
        </header>
        <main>{renderVnode().map((vn) => vn)}</main>
      </div>
    );
  }
});
