<template>
  <div>
    <h3>关于vue父子组件挂载顺序</h3>
  </div>
  <hr />
  <h5>1.组件自身声明周期调用顺序</h5>
  <ul>
    <li>父--setup</li>
    <li>父--beforeCreated</li>
    <li>父--created</li>
    <li>父--beforeMount</li>
    <li>父--mounted</li>
  </ul>
  <div>
    <p>挂载子组件</p>
    <ShowNum :activeNum="childProp"></ShowNum>
    <h5>2.父子组件挂载声明周期执行顺序</h5>
    <ul>
      <li>父--setup</li>
      <li>父--beforeCreated</li>
      <li>父--created</li>
      <li>父--beforeMount</li>
      <li style="color: red">子--setup</li>
      <li style="color: red">子--beforeCreated</li>
      <li style="color: red">子--created</li>
      <li style="color: red">子--beforeMount</li>
      <li style="color: red">子--mounted</li>
      <li>父--mounted</li>
    </ul>
    <h5>3.父组件更新造成子组件更新顺序</h5>
    <button @click="childProp += 1">+1</button>
    <button @click="parentNum += 1">不影响子组件数据变化</button>
    <span>父组件自身数据变化:{{ parentNum }}</span>
    <ul>
      <li>父--beforeUpdate</li>
      <li style="color: red">子--beforeUpdate</li>
      <li style="color: red">子--udated</li>
      <li>父--udated</li>
    </ul>
    <div>****注意：子组件没有用到的父组件数据更新，只会使得父组件更新，子组件不会更新</div>
    <h5>4.子组件自身数据更新情况</h5>
    <ul>
      <li>子组件自身数据改变更新，不会造成父组件更新</li>
    </ul>
    <h5>5.父子组件卸载顺序</h5>
    <ul>
      <li>父--BeforeUnmount</li>
      <li style="color: red">子--BeforeUnmount</li>
      <li style="color: red">子--Unmounted</li>
      <li>父--Unmounted</li>
    </ul>
  </div>
</template>

<script>
import { onBeforeMount, onMounted, ref, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue';
import ShowNum from '@/components/ShowNum.vue';
export default {
  components: {
    ShowNum
  },
  setup() {
    console.log('父--setup');
    const childProp = ref(0);
    const parentNum = ref(0);
    onBeforeMount(() => {
      console.log('父--beforeMount');
    });
    onMounted(() => {
      console.log('父--mounted');
    });
    onBeforeUpdate(() => {
      console.log('父--beforeUpdate');
    });
    onUpdated(() => {
      console.log('父--udated');
    });
    onBeforeUnmount(() => {
      console.log('父--BeforeUnmount');
    });
    onUnmounted(() => {
      console.log('父--Unmounted');
    });
    return {
      childProp,
      parentNum
    };
  },
  beforeCreate() {
    console.log('父--beforeCreated');
  },
  created() {
    console.log('父--created');
  }
};
</script>
