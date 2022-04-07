import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  VNode,
  resolveComponent,
  createVNode,
  PropType,
  toRef,
  inject,
  ComponentOptions,
  onUpdated,
  nextTick,
  watch,
  Ref
} from 'vue';
import {
  IRenderNodeType,
  deepClone,
  buildTreeDataByLevelData,
  IRegisterComponentMapType,
  EventBus
} from '@/utils/index';

import { useClickEvent } from './useClickEvent';

import style from './style.module.scss';
import './globalPage.scss';

interface ComponentProps {
  [propsName: string]: any;
}

export default defineComponent({
  emits: ['editCanvasDragOver', 'editCanvasDrop', 'editCanvasMaterialClick', 'editCanvasCopyNode'],
  props: {
    canvasData: {
      type: Array as PropType<Array<IRenderNodeType>>,
      default: () => [],
      required: false
    },
    activeNodeId: {
      type: Number,
      default: -1,
      required: true
    }
  },
  setup(props, { emit }) {
    const activeMaterialNode = 'activeMaterialNode';
    const editorData = toRef(props, 'canvasData');
    const selectNodeId = toRef(props, 'activeNodeId');
    const canvasDom = ref<HTMLDivElement | null>(null);
    const materialMap = inject<IRegisterComponentMapType>('materialMap');
    const { listenerClick, lookActiveNodeClass } = useClickEvent(emit);
    /**
     * @description 物料点击
     *
     * @param {MouseEvent} e
     * @param {string} conponentName
     * @param {number} conponentId
     */
    const materialClick = (e: MouseEvent, componentName: string, componentId: number) => {
      e.stopPropagation();
      emit('editCanvasMaterialClick', componentName, componentId);
    };

    /**
     * 依据dom树数据递归构建vnode
     * */
    const recurrenceBuildVnode = (arr: Array<IRenderNodeType>): Array<VNode> => {
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
        // 自身id
        componentProp['data-node-id'] = arr[i].id;
        // 容器标识
        componentProp['data-drop'] = (materialMap as IRegisterComponentMapType)[arr[i].key].isContainer
          ? 'true'
          : 'false';
        // 活动标识id
        if (arr[i].id === selectNodeId.value) {
          componentProp['id'] = activeMaterialNode;
        }
        const linePie = createVNode(
          componentName,
          {
            onClick: (e: MouseEvent) => materialClick(e, (componentName as ComponentOptions).name ?? '', arr[i].id),
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
      const placeHolder = (
        <span class={style.placeholder}>从左侧列表中选择一个组件, 然后用鼠标拖动组件放置于此处.</span>
      );
      if (editorData.value.length > 0) {
        const vnodeArr = createVnodeByData(deepClone(editorData.value));
        vnodeArr.forEach((vn) => vnodeList.push(vn));
        return vnodeList;
      } else {
        vnodeList.push(placeHolder);
        return vnodeList;
      }
    };

    /**
     * @description 拖拽经过画布区域
     */
    const dragOver = (e: DragEvent) => {
      emit('editCanvasDragOver', e);
    };
    /**
     * @description 拖拽放置
     *
     * @param {DragEvent} e
     */
    const drop = (e: DragEvent) => {
      emit('editCanvasDrop', e);
    };
    watch(selectNodeId, (val) => {
      console.log('新值：' + val);
    });
    /**
     * @description 更新之后检查活动节点附加控制区域样式
     *
     */
    async function onUpdatedLookActiveNodeClass() {
      // setTimeout(() => {
      //   const activeDom = document.getElementById(activeMaterialNode);
      //   lookActiveNodeClass(activeDom);
      // }, 50);
      await nextTick();
      const activeDom = document.getElementById(activeMaterialNode);
      lookActiveNodeClass(activeDom);
    }

    /**
     * @description 新增节点，自动添加控制区
     * */
    // EventBus.$on('addNode', 'autoAddHandle', (data: IRenderNodeType) => {
    //   console.log('监听节点添加');
    // });

    onMounted(() => {
      const dropDom = canvasDom.value as HTMLDivElement;
      dropDom.addEventListener('dragover', dragOver);
      dropDom.addEventListener('drop', drop);
      dropDom.addEventListener('click', listenerClick, true);
    });

    onUpdated(() => {
      onUpdatedLookActiveNodeClass();
    });

    onBeforeUnmount(() => {
      const dropDom = canvasDom.value as HTMLDivElement;
      dropDom.removeEventListener('dragover', dragOver);
      dropDom.removeEventListener('drop', drop);
      dropDom.removeEventListener('click', listenerClick);
      EventBus.$off('addNode', 'autoAddHandle');
    });

    return () => (
      <div
        class={style['edit-view']}
        id="canvasRoot"
        data-canvas-root="true"
        data-drop="true"
        data-node-id="null"
        ref={canvasDom}
      >
        {renderVnode().map((vn) => vn)}
      </div>
    );
  }
});
