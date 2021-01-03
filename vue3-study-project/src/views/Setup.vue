<template>
  <div class="router-page setup">
    <ul>
      <li>
        <p><i>setup执行时机</i></p>
        <p>setup在beforeCreate和created两个生命周期之间执行</p>
        <ul>
          <li>beforeCreate: 表示组件刚刚被创建出来，组件的data和methods还没有初始化好</li>
          <li>setup</li>
          <li>created: data和methods已经初始化好</li>
        </ul>
      </li>
      <li>
        <p><i>setup注意点</i></p>
        <ul>
          <li>由于在执行setup函数的时候，还没有执行created生命周期方法，所以在setup函数中，是无法使用data和methods</li>
          <li>由于我们不能在setup函数中无法使用data和methods，所以Vue为了避免我们错误的使用，它直接将函数中的this修改成了undefined <i>setup内无法访问this</i></li>
          <li>setup函数只能是同步的，不能是异步的</li>
        </ul>
      </li>
      <li>
        <p><i>setup内生命周期优于options api生命周期执行</i></p>
        <p>详见console.log</p>
      </li>
      <li>
        <p><i>setup参数</i></p>
        <p>使用 setup 函数时，它将接受两个参数：</p>
        <p>1.props</p>
        <p>2.context</p>
        <ul>
          <li>
            <p>props</p>
            <p>setup 函数中的第一个参数是 props。</p>
            <p>setup 函数中的 props 是响应式的，当传入新的 prop 时，它将被更新。</p>
            <p><i>WARNING</i>:但是，因为 props 是响应式的，你不能使用 ES6 解构，因为它会消除 prop 的响应性</p>
            <p>如果需要解构 prop，可以通过使用 setup 函数中的 toRefs 来完成此操作：const { title } = toRefs(props)</p>
            <p>如果 title 是可选的 prop，则传入的 props 中可能没有 title 。在这种情况下，toRefs 将不会为 title 创建一个 ref 。你需要使用 toRef 替代它：const title = toRef(props, 'title')</p>
          </li>
          <li>
            <p>context</p>
            <p>传递给 setup 函数的第二个参数是 context。context 是一个普通的 JavaScript 对象，它暴露三个组件的 property：</p>
            <p>1.context.attrs // // Attribute (非响应式对象)</p>
            <p>2.context.slots // // 插槽 (非响应式对象)</p>
            <p>3.context.emit // // 触发事件 (方法)</p>
            <p>context 是一个普通的 JavaScript 对象，也就是说，它不是响应式的，这意味着你可以安全地对 context 使用 ES6 解构。setup(props, { attrs, slots, emit }) </p>
            <p><i>注意：</i></p>
            <p>attrs 和 slots 是有状态的对象，它们总是会随组件本身的更新而更新。这意味着你应该避免对它们进行解构，并始终以 attrs.x 或 slots.x 的方式引用 property。</p>
            <p>请注意，与 props 不同，attrs 和 slots 是非响应式的。如果你打算根据 attrs 或 slots 更改应用副作用，那么应该在 onUpdated 生命周期钩子中执行此操作。</p>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>>

<script>
import { onBeforeMount, onMounted } from 'vue';
export default {
  name: 'Setup',
  beforeCreate() {
    console.log('options beforeCreated');
  },
  created() {
    console.log('options created');
  },
  beforeMount() {
    console.log('options beforeMount');
  },
  mounted() {
    console.log('options monted');
  },
  setup() {
    console.log('setup runing');
    onBeforeMount(() => {
      console.log('componsition beforeMount');
    });
    onMounted(() => {
      console.log('componsition Mount');
    });
  }
};
</script>

<style lang="scss">
  
</style>