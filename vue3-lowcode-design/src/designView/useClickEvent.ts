interface IFunReturnType {
  listenerClick: (e: MouseEvent) => void;
  lookActiveNodeClass: (targetDom: HTMLElement | null) => void;
}
type LimitEmit = 'editCanvasDragOver' | 'editCanvasDrop' | 'editCanvasMaterialClick' | 'editCanvasCopyNode';
type EmitType = (type: LimitEmit, ...args: any[]) => void;

let cacheDom: HTMLElement | null = null;
const limitMinWidth = 240;
const limitToRightWidth = 240;

export function useClickEvent(emit: EmitType): IFunReturnType {
  /**
   * @description 添加节点
   *
   * @param {string} nodeId
   */
  function addNode(nodeId: string) {
    emit('editCanvasCopyNode', Number(nodeId));
  }
  /**
   * @description 向上移动节点
   *
   * @param {string} nodeId
   */
  function upMove(nodeId: string) {
    console.log(nodeId);
  }
  /**
   * @description 向下移动节点
   *
   * @param {string} nodeId
   */
  function downMove(nodeId: string) {
    console.log(nodeId);
  }
  /**
   * @description 删除节点
   *
   * @param {string} nodeId
   */
  function delNode(nodeId: string) {
    console.log(nodeId);
  }

  /**
   * @description 删除控制区
   *
   * @param {HTMLElement} target
   */
  function removeHandleArea(target: HTMLElement) {
    for (let i = 0; i < target.children.length; i++) {
      if (target.children[i].getAttribute('id') === 'handleAreaDom') {
        target.removeChild(target.children[i]);
        break;
      }
    }
  }
  /**
   * @description 添加控制区
   *
   * @param {HTMLElement} target
   */
  function addHandleArea(target: HTMLElement, nodeId: string) {
    const handleArea = document.createElement('div');
    const targetWidth = parseInt(window.getComputedStyle(target).width);
    if (targetWidth > limitMinWidth) {
      handleArea.setAttribute('style', 'position: absolute; bottom:0;right:0; padding: 4px; background: #409EFF');
    } else {
      const canvasRoot = document.getElementById('canvasRoot') as HTMLDivElement;
      if (canvasRoot?.getBoundingClientRect().right - target.getBoundingClientRect().right >= limitToRightWidth) {
        handleArea.setAttribute(
          'style',
          'position: absolute; bottom:0;right:-180px; padding: 4px; background: #409EFF'
        );
      } else {
        handleArea.setAttribute(
          'style',
          'position: absolute; bottom:0;left: -180px; padding: 4px; background: #409EFF'
        );
      }
    }
    handleArea.setAttribute('id', 'handleAreaDom');
    // add
    const addButton = document.createElement('button');
    addButton.innerText = '添加';
    addButton.addEventListener('click', (e) => {
      e.stopPropagation();
      addNode(nodeId);
    });
    // up
    const upButton = document.createElement('button');
    upButton.innerText = '向上';
    upButton.onclick = () => upMove(nodeId);
    // down
    const downButton = document.createElement('button');
    downButton.innerText = '向下';
    downButton.onclick = () => downMove(nodeId);
    // del
    const delButton = document.createElement('button');
    delButton.innerText = '删除';
    delButton.onclick = () => delNode(nodeId);
    handleArea.appendChild(addButton);
    handleArea.appendChild(upButton);
    handleArea.appendChild(downButton);
    handleArea.appendChild(delButton);
    target.appendChild(handleArea);
  }
  /**
   * @description 选中节点添加操作区域
   *
   * @param {HTMLElement} targetDom
   * @param {number} vnodeId
   */
  function addNodeHandleArea(targetDom: HTMLElement, vnodeId: number) {
    cacheDom ? cacheDom.classList.remove('click-selected') : null;
    cacheDom ? removeHandleArea(cacheDom) : null;
    targetDom.classList.contains('click-selected') ? '' : targetDom.classList.add('click-selected');
    addHandleArea(targetDom, vnodeId + '');
    cacheDom = targetDom;
  }
  /**
   * @description 节点更新后调整控制区
   *
   */
  function resizeHandlePosition() {
    const handleDom = document.getElementById('handleAreaDom');
    if (handleDom) {
      const activeNodeDom = handleDom.parentElement as HTMLElement;
      const parentWidth = parseInt(window.getComputedStyle(activeNodeDom).width);
      if (parentWidth > limitMinWidth) {
        handleDom.setAttribute('style', 'position: absolute; bottom:0;right:0; padding: 4px; background: #409EFF');
      } else {
        const canvasRoot = document.getElementById('canvasRoot') as HTMLDivElement;
        if (
          canvasRoot?.getBoundingClientRect().right - activeNodeDom.getBoundingClientRect().right >=
          limitToRightWidth
        ) {
          handleDom.setAttribute(
            'style',
            'position: absolute; bottom:0;right:-180px; padding: 4px; background: #409EFF'
          );
        } else {
          handleDom.setAttribute(
            'style',
            'position: absolute; bottom:0;left: -180px; padding: 4px; background: #409EFF'
          );
        }
      }
    }
  }
  /**
   * @description 检查选中节点是否还存在控制区域和样式
   *
   * @param {(HTMLElement | null)} targetDom
   */
  function lookActiveNodeClass(targetDom: HTMLElement | null) {
    if (targetDom) {
      const targetNodeId = targetDom.getAttribute('data-node-id');
      addNodeHandleArea(targetDom, Number(targetNodeId));
    }
  }

  /**
   * @description 画布组件选择
   * */
  const listenerClick = (e: MouseEvent) => {
    const targetDom = e.target as HTMLElement;
    if (targetDom?.getAttribute('data-canvas-root')) {
      // 属性设置区清空
      emit('editCanvasMaterialClick', '', -1);
      // 移除选中状态
      cacheDom ? cacheDom.classList.remove('click-selected') : null;
      cacheDom ? removeHandleArea(cacheDom) : null;
    }
  };

  return {
    listenerClick,
    lookActiveNodeClass
  };
}
