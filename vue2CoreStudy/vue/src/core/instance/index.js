import { initMixin } from "./init";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { eventsMixin } from "./events";
import { lifecycleMixin } from "./lifecycle";
import { warn } from "../util/index";

function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}

// 实例方法的初始化
initMixin(Vue); // 混入_init()
stateMixin(Vue); // 实现$set/$delete/$watch方法
eventsMixin(Vue); // 实现$emit/$on/$off/$once四个方法
lifecycleMixin(Vue); // 实现_update/$forceUpdate/$destory三个方法
renderMixin(Vue); // 实现_render/$nextTick方法

export default Vue;
