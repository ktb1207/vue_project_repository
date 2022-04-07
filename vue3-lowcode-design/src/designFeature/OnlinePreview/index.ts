import { createVNode, createApp, Ref } from 'vue';
import onlinePreviewSfc from './OnlinePreview';
import { IRenderNodeType, useMaterialRegister } from '@/utils/index';
import designComponent from '@/designComponents/index';

/**
 * @description 应用样式
 *
 * @param {HTMLElement} dom
 */
function setRootStyle(dom: HTMLElement) {
  dom.setAttribute('style', 'position: fixed; z-index: 2; top:0; right: 0;bottom:0; left: 0; background: #fff');
}

/**
 * @description 预览
 *
 * @param {Array<IRenderNodeType>} previewData
 * @return {*}
 */
function OnlinePreview(previewData: Ref<Array<IRenderNodeType>>) {
  // 关闭预览
  function unmountApp() {
    onlineApp.unmount();
    document.body.removeChild(createRoot);
  }
  // 物料注册信息
  const { componentRegisterMap } = useMaterialRegister();
  // 创建应用实例
  const onlineApp = createApp(
    createVNode(onlinePreviewSfc, {
      canvasData: previewData.value,
      onClose: unmountApp
    })
  );
  // 创建挂载入口
  const createRoot = document.createElement('div');
  setRootStyle(createRoot);
  document.body.appendChild(createRoot);
  // 注册组件
  onlineApp.use(designComponent);
  // 提供物料信息
  onlineApp.provide('materialMap', componentRegisterMap);
  const onlineInstance = onlineApp.mount(createRoot);
  return {
    onlineInstance,
    unMountOnline() {
      onlineApp.unmount();
      document.body.removeChild(createRoot);
    }
  };
}

export { OnlinePreview };
