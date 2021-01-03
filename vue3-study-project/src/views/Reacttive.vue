<template>
  <div class="router-page reactive">
    <ul>
      <li>
        <p><i>什么是reactive?</i></p>
        <p>reactive是Vue3中提供的实现响应式数据的方法</p>
        <p>在Vue2中响应式数据是通过defineProperty来实现的，而在Vue3中响应式数据是通过ES6的Proxy来实现的</p>
      </li>
      <li>
        <p><i>reactiv注意点</i></p>
        <p>1.reactive参数必须是对象（json/arr）</p>
        <p>2.如果给reactive传递了其他对象</p>
        <p class="indent-left">默认情况下修改对象，界面不会自动更新</p>
        <p class="indent-left">如果想更新，可以通过重新赋值的方式</p>
        <p>
          <span><i>测试reactive简单值:</i>{{stateNum}}</span>
          <button @click="addStateNum">点我尝试改变</button>
        </p>
        <p>例1：将简单值传递给reactive,修改值，值改变，页面不会更新</p>
      </li>
      <li>
        <p><i>reactive数组测试</i></p>
        <p>
          <button @click="pushArr">push</button>
          <button @click="popArr">pop</button>
          <button @click="indexArr">数组索引改变值</button>
          <button @click="lengthArr">通过数组长度改变数组</button>
        </p>
        <ol>
          <li v-for="(item, index) in observeArr" :key="index">{{item}}</li>
        </ol>
        <p>总结:</p>
        <p class="indent-left">在vue2.0中，通过数组索引修改值和通过修改数组长度，操作不是响应式，页面不会变化</p>
        <p class="indent-left">但在vue3中，通过数组索引修改值和通过修改长度，修改数据是响应式的。</p>
      </li>
      <li>
        <p><i>data数组测试</i></p>
        <p>
          <button @click="editDataArrByIndex">数组索引改变值</button>
          <button @click="editDataArrByLength">通过数组长度改变数组</button>
        </p>
        <ol>
          <li v-for="(item, index) in dataArr" :key="index">{{item}}</li>
        </ol>
        <p>总结：</p>
        <p class="indent-left">data数组通过索引值修改和reactive数据一致</p>
        <p class="indent-left">data数组通过长度修改和reactive数据一致</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { onMounted, reactive } from 'vue';
export default {
  name: 'Reactive',
  data() {
    return {
      dataArr: ['q', 'w', 'z', 'e']
    };
  },
  setup() {
    // 本质：就是将传入的数据包装成一个Proxy对象
    // 例1
    let stateNum = reactive(123);
    function addStateNum() {
      stateNum = 666;
      console.log(stateNum);
    };
    // 例2
    const testArr = ['a','b','c','d'];
    const observeArr = reactive(testArr);
    const pushArr = () => {
      observeArr.push(new Date().getDay());
    };
    const popArr = () =>{
      observeArr.pop();
    };
    const indexArr = () => {
      observeArr[0] = 'qaz';
    };
    const lengthArr = () => {
      observeArr.length = 2;
    };
    // 打印reactive数据类型
    onMounted(() => {
      console.log(testArr);
    });
    return {
      stateNum,
      addStateNum,
      observeArr,
      pushArr,
      popArr,
      indexArr,
      lengthArr
    };
  },
  methods: {
    // 数组索引改变值
    editDataArrByIndex() {
      this.dataArr[2] = 'op';
    },
    // 通过数组长度改变数组
    editDataArrByLength() {
      this.dataArr.length = 2;
    }
  }
};
</script>

<style lang="scss">
  
</style>