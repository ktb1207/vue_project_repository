<template>
  <div class="router-page isreactive">
    关于isRef和isReactive api
    <ul>
      <li>
        通过 isRef 和 isReactive 可以判断数据是 ref 还是 reactive,返回Boolean值true或false;
      </li>
      <li>
        详见console.log()
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, reactive, isReactive, isRef, onMounted } from 'vue';
export default {
  name: 'IsReactiveAndIsRef',
  setup() {
    let age = ref(18);
    let state = reactive({age: 18});
    onMounted(() =>{
      console.log(isRef(age));
      console.log(isRef(state));
      console.log(isReactive(age));
      console.log(isReactive(state));
    });
  }
};
</script>

<style lang="scss">

</style>