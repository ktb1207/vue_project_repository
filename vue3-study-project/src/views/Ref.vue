<template>
  <div class="router-page ref">
    <ul>
      <li>
        <p><i>什么是ref?</i></p>
        <ol>
          <li>ref和reactive一样，也是用来实现响应式数据的方法</li>
          <li>由于reactive必须传递一个对象，所以导致在企业开发中如果我们只想让某个变量实现响应式的时候会非常麻烦，所以Vue3就给我们提供了ref方法，实现对简单值的监听</li>
        </ol>
      </li>
      <li>
        <p><i>ref本质</i></p>
        <p>ref底层的本质其实还是reactive，系统会自动根据我们给ref传入的值将它转换成ref(xx) -> reactive({value: xx})</p>
      </li>
      <li>
        <p><i>ref注意点</i></p>
        <p>在template中使用ref的值不用通过value获取</p>
        <p>在js中使用ref的值必须通过value获取</p>
      </li>
      <li>
        <p><i>Vue是如何判断ref和reactive数据类型?</i></p>
        <p>一、Vue在处理的时候会先判断数据是什么类型的</p>
        <p class="indent-left">如果在template里面使用的是ref类型的数据，那么Vue会自动帮我们添加.value</p>
        <p class="indent-left">如果template里使用的是reactive类型的数据，那么Vue不会自动帮我们添加.value</p>
        <p>二、Vue是如何判断数据类型的呢？--详见console打印ref数据结果</p>
        <p class="indent-left">通过当前数据的 __v_isRef 来判断，如果有这个私有属性，并且取值为true，那么就代表是一个ref类型的数据</p>
      </li>
    </ul>
    <p>例子1</p>
    <div>
      <p>
        <button @click="addAge">增加年龄</button>
      </p>
      <p>我的年龄是：<i>{{age}}</i></p>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
export default {
  name: 'Ref',
  setup() {
    let age = ref(18);
    const addAge = () =>{
      age.value += 1;
    };
    onMounted(() => {
      // 打印ref数据类型
      console.log(age);
    });
    return {
      age,
      addAge
    };
  }
};
</script>

<style lang="scss">
  
</style>