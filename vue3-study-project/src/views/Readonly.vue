<template>
  <div class="router-page">
    <ul>
      <li>
        <p><i>readonly</i></p>
        <p>作用：获取一个对象 (响应式或纯对象) 或 ref 并返回原始 proxy 的只读 proxy。只读 proxy 是深层的：访问的任何嵌套 property 也是只读的。</p>
        <p>
          <button @click="testReadonly">测试readonly</button>
        </p>
        <p>响应式数据：<i>{{reactiveObjOne.name}}</i></p>
        <p>说明：</p>
        <ul>
          <li>修改reactive包装对象，readonly包装数据值会同步修改</li>
          <li>修改readonly包装对象，修改失败并导致警告！</li>
        </ul>
      </li>
      <li>
        <p><i>shallowReadonly</i></p>
        <p>作用：创建一个 proxy，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换 </p>
      </li>
      <li>
        <p><i>isReadonly</i></p>
        <p>作用：检查对象是否是由readonly创建的只读 proxy。</p>
      </li>
      <li>
        <p><i>readonly 和 const 的区别</i></p>
        <p>const：赋值保护，不能给变量重新赋值</p>
        <p>readonly：属性保护，不能给属性重新赋值</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive, readonly } from 'vue';
export default {
  name: 'Readonly',
  setup() {
    const originalObj = {
      name: '李四',
      child: {
        name: '王五'
      }
    };
    const reactiveObjOne = reactive(originalObj);
    const readonlyObj = readonly(reactiveObjOne);
    const testReadonly = () =>{
      reactiveObjOne.name = '789';
      console.log(readonlyObj);
      readonlyObj.name = '456';
    };
    return {
      reactiveObjOne,
      testReadonly
    };

  }
};
</script>