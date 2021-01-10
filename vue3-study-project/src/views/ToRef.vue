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
      <li>
        <p><i>ref和toRef的区别：</i></p>
        <p>说明：以下区别只针对使用ref或者toRef包装一个对象的某一个属性值的情况</p>
        <p>原因：在使用ref包装一个完整对象时，修改响应对象是会影响原对象对应属性值,ref的本质是复制，基本类型值是复制，引用类型值是浅拷贝引用的关系</p>
        <p>区别：</p>
        <ul>
          <li>ref->拷贝（浅），修改响应式数据不会影响以前的数据</li>
          <li>toRef->引用，修改响应式数据会影响以前的数据</li>
          <li>ref->数据发生改变，界面就会自动更新</li>
          <li>toRef->数据发生改变，界面也不会自动更新</li>
        </ul>
      </li>
      <li>
        <p><i>toRefs</i></p>
        <p>作用：将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的ref</p>
        <p>参数：reactive包装返回对象</p>
        <p>数据更新结果：我名字叫：<i>{{toRefsObj.name.value}}</i>,我今年<i>{{toRefsObj.age.value}}</i>岁</p>
        <p><button @click="editToRefsData">尝试修改数据</button></p>
        <p>总结：</p>
        <ul>
          <li>修改toRefs返回的响应式数据，数据变化并且同步更新原始对象数据，但是页面不会更新</li>
          <li>可以批量将reactive包装的所有对象property包装成ref响应式数据，并且响应式数据更新不会更新页面</li>
        </ul>
        <p>使用场景：</p>
        <ul>
          <li>在对reactive包装包装返回对象进行解构的情况下不失去响应性</li>
          <li>const state = reactive({age: 12, name: 'tom'}}})</li>
          <li>const toRefsState = toRefs(state)</li>
          <li>const {age, name} = toRefsState</li>
        </ul>
      </li>
      <li>
        <p><i>customRef</i></p>
        <p>作用：创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制</p>
        <p>说明：它需要一个工厂函数，该函数接收 track 和 trigger 函数作为参数，并应返回一个带有 get 和 set 的对象</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, toRef, triggerRef, toRefs, reactive} from 'vue';
export default {
  name: 'ToRef',
  setup() {
    // ref
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
    // toRef
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
    // toRefs
    const objThree = {
      name: '王五',
      age: 18
    };
    const reactiveThree = reactive(objThree);
    const toRefsObj = toRefs(reactiveThree);
    const editToRefsData = () => {
      toRefsObj.name.value = '张三123';
      toRefsObj.age.value = 24;
      console.log(toRefsObj); // {name: ObjectRefIml, age: ObjectRefIml}
      console.log(objThree); // {name: '张三123', age: 24}
    };
    return {
      refObj,
      editRefData,
      tRefObj,
      editToRefData,
      toRefsObj,
      editToRefsData
    };
  }
};
</script>

<style lang="scss">
  
</style>