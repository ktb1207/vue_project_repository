<template>
  <div class="router-page notRecursion">
    <h3>关于vue3中的非递归监听</h3>
    <p>
      1.说明：
    </p>
    <p class="indent-left">默认情况下，无论是通过ref还是通过reactive都是递归监听</p>
    <p>
      2.递归监听存在的问题：
    </p>
    <p class="indent-left">
      如果数据量比较大，非常消耗性能因为递归监听将使每一层都被包装成一个Proxy
    </p>
    <h3>vue3中提供以下非递归监听api</h3>
    <ul>
      <li>
        <p><i>shallowReactive</i></p>
        <p class="indent-left">用法：同reactive,不同的是只将原对象第一层包装成proxy，其它层不会被包装proxy,数据无响应性</p>
        <h5>例子1：reactive</h5>
        <p>
          我是reactive创建:{{reactiveObj.child.age}}
          <button @click="addReactive">点我自增</button>
        </p>
        <div class="indent-left">
          <span>总结：</span>
          <p>1.由reactive创建的对象是递归监听</p>
          <p>2.修改proxy创建出的对象，数据是响应性的，并修改原对象对应值</p>
          <p>3.修改reactive参数原对象，原对象和proxy创建对象数据都会变化，但是页面不会更新，修改原对象不是响应性。</p>
        </div>
        <h5>例子2：shallowReactive</h5>
        <p>
          我是shallowReactive创建{{shallowObj.child.age}},但是不会更新，不信你试试？
          <button @click="addShallow">点我试试？</button>
        </p>
        <div class="indent-left">
          <span>总结：</span>
          <p>1.shallowReactive创建的只会将原对象第一层包装成proxy对象，子层级对象不会包装proxy</p>
          <p>修改shallowReactive创建的子对象值，值会发生变化，但是不会响应到页面更新，原对象值也一并修改</p>
        </div>
      </li>
      <li>
        <p><i>shallowRef</i></p>
        <p>用法同ref,不同的是只会包装第一层为proxy</p>
        <p>shallowRef本质：</p>
        <p class="indent-left">1.ref->reactive</p>
        <p class="indent-left">2.ref(10)->reactive({value: 10})</p>
        <p class="indent-left">3.shallowRef->shallowReactive</p>
        <p class="indent-left">4.shallowRef(10)->shallowReactive({value: 10})</p>
        <p class="indent-left">所以如果是通过shallowRef创建的数据，它监听的是.value的变化，因为底层本质上value才是第一层</p>
      </li>
      <li>
        <p><i>triggerRef</i></p>
        <p>场景：由于shallowRef创建的响应式对象只会将第一层.value包装成proxy,里面深层次对象值的修改，页面无法响应式更新</p>
        <p>作用：手动执行shallowRef创建的值修改后执行页面更新</p>
      </li>
      <li>
        <p><i>toRaw</i></p>
        <p>
          场景：
          ref/reactive数据类型的特点：每次修改都会被追踪，都会更新UI界面，但是这样其实是非常消耗性能的，所以如果我们有一些操作不需要追踪，不需要更新UI界面，
          那么这个时候，我们就可以通过toRaw方法拿到它的原始数据，对原始数据进行修改，这样就不会被追踪，这样就不会更新UI界面
        </p>
        <p>作用：返回 reactive 或 readonly proxy 的原始对象。</p>
        <p>注意：可用于临时读取而不会引起 proxy 访问/跟踪开销，也可用于写入而不会触发更改。不建议保留对原始对象的持久引用。请谨慎使用。</p>
      </li>
      <li>
        <p><i>ref的toRaw</i></p>
        <p>
          说明：
          如果想通过toRaw拿到ref类型的原始数据（创建时传入的那个数据），那么就必须明确告诉toRaw方法，要获取的是.value的值，
          因为经过Vue处理之后.value中保存的才是当初创建时传入的那个原始数据
        </p>
        <p> let state = ref(obj)</p>
        <p>let obj2 = toRaw(state.value)</p>
      </li>
      <li>
        <p><i>markRaw</i></p>
        <p>作用：markRaw标记某个数据永远不会被追踪</p>
        <p>markRaw标记过的数据，reactive或者ref无法将该数据包装proxy响应式数据</p>
      </li>
    </ul>
    <p class="indent-left"></p>
    <p class="indent-left"></p>
    <p class="indent-left"></p>
  </div>
</template>

<script>
import { reactive, shallowReactive } from 'vue'; 
export default {
  name: 'NotRecursion',
  setup() {
    const originalObj = {
      name: '刘德华',
      age: 55,
      child: {
        childName: '刘四',
        age: 14
      }
    };
    const testShallowObj = {
      name: '张学友',
      age: 12,
      child: {
        childName: '张三',
        age: 2
      }
    };
    let reactiveObj = reactive(originalObj);
    let shallowObj = shallowReactive(testShallowObj);
    const addReactive = () =>{
      // reactiveObj.child.age += 1;
      originalObj.child.age += 1;
      console.log(originalObj);
      console.log(reactiveObj);
    };
    const addShallow = () => {
      shallowObj.child.age += 1;
      console.log(testShallowObj);
      console.log(shallowObj);
    };
    return {
      reactiveObj,
      shallowObj,
      addReactive,
      addShallow
    };
  }
};
</script>

<style lang="scss">
  
</style>