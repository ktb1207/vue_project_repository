<template>
  <div>
    <p>当前数值:{{ showNum }}</p>
    <div>
      <span>子组件自身数据：{{ childNum }}</span>
      <button @click="childNum += 1">子组件改变自身数据</button>
    </div>
  </div>
</template>

<script>
import { toRef, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, ref, onBeforeUnmount, onUnmounted } from 'vue';
export default {
  name: 'ShowNum',
  props: {
    activeNum: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    console.log('子--setup');
    const showNum = toRef(props, 'activeNum');
    const childNum = ref(0);
    onBeforeMount(() => {
      console.log('子--beforeMount');
    });
    onMounted(() => {
      console.log('子--mounted');
    });
    onBeforeUpdate(() => {
      console.log('子--beforeUpdate');
    });
    onUpdated(() => {
      console.log('子--udated');
    });
    onBeforeUnmount(() => {
      console.log('子--BeforeUnmount');
    });
    onUnmounted(() => {
      console.log('子--Unmounted');
    });
    return {
      showNum,
      childNum
    };
  },
  beforeCreate() {
    console.log('子--beforeCreated');
  },
  created() {
    console.log('子--created');
  }
};
</script>
