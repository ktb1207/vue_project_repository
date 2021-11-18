<template>
  <div>
    <h5>关于proxy使用详解</h5>
    <div>
      <button @click="originalHandle">原始对象操作</button>
      <button @click="proxyHandle">代理对象操作</button>
    </div>
    <ul>
      <li>修改原始对象和代理对象都会同步修改</li>
      <li>修改原始对象不会被拦截捕获</li>
      <li>修改代理对象可以被get set捕获</li>
    </ul>
    <hr />
    <p>reactive值{{ reactiveObj.num }}</p>
    <button @click="reactiveHandle">reactive操作</button>
    <ul>
      <li>proxy代理对象可以作为vue响应方法reactive的参数</li>
      <li>修改reactive代理对象，proxy代理对象handle可以捕获</li>
    </ul>
    <hr />
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
export default {
  name: 'Proxy',
  setup() {
    // 原始对象
    const originalObj = {
      num: 0
    };
    // 代理对象
    const proxyObj = new Proxy(originalObj, {
      get(target, propKey, receiver) {
        return Reflect.get(target, propKey, receiver);
      },
      set(target, propKey, value, receiver) {
        // console.log(target);
        // console.log(propKey);
        // console.log(value);
        // console.log(receiver);
        return Reflect.set(target, propKey, value, receiver);
      }
    });
    /**
     * @description 修改原始对象
     * 修改原始对象，原始对象和代理对象都会改变
     * */
    const originalHandle = () => {
      originalObj.num += 3;
      console.log(proxyObj);
      console.log(originalObj);
    };
    /**
     * @description 修改代理对象
     * 修改代理对象，原始对象和代理对象都会改变
     *
     * 触发代理对象set
     *
     */
    const proxyHandle = () => {
      proxyObj.num += 1;
      console.log(proxyObj);
      console.log(originalObj);
    };
    const reactiveObj = reactive(proxyObj);
    const reactiveHandle = () => {
      reactiveObj.num += 5;
    };
    return {
      originalHandle,
      proxyHandle,
      reactiveObj,
      reactiveHandle
    };
  }
};
</script>
