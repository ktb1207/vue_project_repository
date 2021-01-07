<template>
  <div class="router-page toRef">
    <h6>为了理解toRef,要和ref对比学习</h6>
    <ul>
      <li>
        <p><i>ref</i></p>
        <p>ref创建数据--：{{refObj}}</p>
        <p>
          <button @click="editRefData">点击修改我的名字</button>
        </p>
        <p>ref使用说明：</p>
        <ul class="indent-left">
          <li>
            使用ref包装整个对象时候，修改ref包装后对象数据，会同步影响原对象对应值
          </li>
          <li>
            使用ref包装一个对象的某一个属性为响应式数据，修改包装后的值，原对象对应属性值不会被影响修改。
          </li>
        </ul>
      </li>
      <li>
        <p><i>toRef</i></p>
        <p>toRef的由来：</p>
        <p class="indent-left">使用ref包装一个对象的某一个属性为响应式数据，修改包装后的值，原对象对应属性值不会被影响修改。</p>
        <p class="indent-left">如果利用toRef将某一个对象中的属性变成响应式的数据，我们修改响应式数据是会影响到原始数据的</p>
        <p>toRef创建的数据--：{{tRefObj}}</p>
        <p>
          <button @click="editToRefData">点我修改toRef包装值，数据是否变化？</button>
        </p>
        <p>toRef说明：</p>
        <ul class="indent-left">
          <li>toRef包装的数据修改，会影响到原对象对应属性值，但是界面不会更新</li>
          <li>triggerRef也不能是界面更新</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, toRef, triggerRef} from 'vue';
export default {
  name: 'ToRef',
  setup() {
    const objOne = {
      name: 'tom',
      age: 12
    };
    const refObj = ref(objOne.name);
    // const refObj = ref(objOne);

    const editRefData = () => {
      refObj.value = new Date().getSeconds() + 's';
      // refObj.value.name = new Date().getSeconds() + 's';
      console.log(objOne);
    };

    const objTwo = {
      name: '张三',
      age: 45
    };
    const tRefObj = toRef(objTwo, 'name');
    const editToRefData = () => {
      tRefObj.value = '李四';
      console.log(objTwo);
      triggerRef(tRefObj);
    };
    return {
      refObj,
      editRefData,
      tRefObj,
      editToRefData
    };
  }
};
</script>

<style lang="scss">
  
</style>