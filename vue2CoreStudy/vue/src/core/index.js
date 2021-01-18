// 引入vue构造器
import Vue from "./instance/index";
// 调用initGlobalAPI方法，定义全局资源
import { initGlobalAPI } from "./global-api/index";
// 是否服务端渲染工具方法
import { isServerRendering } from "core/util/env";
import { FunctionalRenderContext } from "core/vdom/create-functional-component";
// 安装vue_api接口到Vue
initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, "$isServer", {
  get: isServerRendering,
});

Object.defineProperty(Vue.prototype, "$ssrContext", {
  get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  },
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, "FunctionalRenderContext", {
  value: FunctionalRenderContext,
});
// 添加vue版本信息

Vue.version = "__VERSION__";

export default Vue;
