/**
 * LoadingDiv(options)
 * options:{
 *  showPop: true,
 *  delay:3000 || 指定时间
 *  beforeClose：异步关闭方法，支持返回 true,false Propmise
 * }
 * */ 

import Vue from 'vue';
import PopopLoading from './PopopLoading.vue';

// 构造组件
const LoadingConstructor = Vue.extend(PopopLoading);

let loading = undefined; // 单例

// 删除组件
const removeDom = target => {
  target.parentNode.removeChild(target);
};


// 组件关闭方法
LoadingConstructor.prototype.close = function () {
  // 如果loading 有引用，则去掉引用
  if (loading) {
    loading = undefined;
  }
  this.showPop = false;
  // // 延迟300毫秒，等待loading关闭动画执行完之后销毁组件
  setTimeout(() => {
    removeDom(this.$el);
  }, 300);
  // 调用组件的destory进行组件销毁
  this.$destroy();
};


const LoadingDiv = (options = {}) => {
  // 如果组件已渲染，返回
  if (loading) {
    return loading;
  }
  
  console.log(options);
  // 实例化组件
  const instance = new LoadingConstructor({
    el:document.createElement('div'),
    data: options
  });
  // 自定义关闭时间
  const autoTime = options.delay ? options.delay : 3000;
  
  // 添加组件
  document.body.appendChild(instance.$el);
  // 异步关闭
  if (options.beforeClose && typeof options.beforeClose === 'function') {
    const result = Promise.resolve(options.beforeClose());
    console.log(result);
    result.then(res => {
      if (res) {
        instance.close();
      }
    }).catch(err => {
      if (!err) {
        instance.close();
      }
    });
  } else {
    // 自动定时关闭
    Vue.nextTick(() => {
      instance.timer = setTimeout(() => {
        instance.close();
      }, autoTime);
    });
  }

  // 将组件实例赋值给loading
  loading = instance;

  return instance;
};

export default LoadingDiv;

