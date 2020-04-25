<template>
  <div class="about-vue">
    <back-home></back-home>
    <div class="demo-wrp">
      <h2>关于vue核心概论总结：</h2>
    </div>
    <div class="demo-wrp">
      <h3>
        1.Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架.
      </h3>
      <h3>2.Vue.js 的核心是一个允许采用简洁的模板语法来声明式地将数据渲染进 DOM 的系统.</h3>
      <h3>
        3.Vue 的另一个重要概念就是组件化，因为它是一种抽象，允许我们使用小型、独立和通常可复用的组件构建大型应用。
        在 Vue 里，一个组件本质上是一个拥有预定义选项的一个 Vue 实例</h3>
      <h3>4.一个 Vue 应用由一个通过 new Vue 创建的根 Vue 实例，以及可选的嵌套的、可复用的组件树组成</h3>
      <h3>5.计算属性(computed) vs 侦听属性(watch):</h3>
      <p>computed:计算属性是基于它们的响应式依赖进行缓存的,只在相关响应式依赖发生改变时它们才会重新求值</p>
      <p>watch:当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的</p>
      <h3>6.对于v-for和v-if要用 key 管理可复用的元素：</h3>
      <p>Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。</p>
      <h3>7.不推荐同时使用 v-if 和 v-for:</h3>
      <p>当 v-if 与 v-for 一起使用时，v-for 具有比 v-if 更高的优先级。</p>
      <h3>8.对象和数组更新检测区别：</h3>
      <p>A:由于 JavaScript 的限制，Vue 不能检测以下数组的变动：</p>
      <p>a1.当你利用索引直接设置一个数组项时</p>
      <p>a2.当你修改数组的长度时</p>
      <p>B:还是由于 JavaScript 的限制，Vue 不能检测对象属性的添加或删除：</p>
      <h3>9.vue的事件分类</h3>
      <div class="content-block">
        <p>
          <i>1.事件分类：</i><span>vue事件分为两类，一个是原生dom事件，一个是组件自定义事件</span>
        </p>
        <p>2.#绑定原生dom事件:v-on:click="handle"</p>
        <p>3.#绑定自定义事件,通过组件内部 $emit('myEvent')触发</p>
        <p v-text="textStr1"></p>
        <p>4.#在自定义组件上绑定原生事件</p>
        <p v-text="textStr2"></p>
      </div>
      <h3>10.vue事件机制深度解析：</h3>
      <div class="content-block">
        <p><i>核心源码解读</i></p>
        <p>1.vue通过解析template里的html提取出dom上的所有属性</p>
        <p>2.通过正则匹配出对应的事件名和对应的事件执行方法</p>
        <p>3.通过gen方法生成事件虚拟渲染函数</p>
        <p>4.事件作为属性注入到虚拟dom 里</p>
        <p>5.虚拟dom转化到实际dom，并调用原生addEventListener绑定事件<i>事件是绑定在元素上并没有用事件委托绑定父元素</i></p>
        <p>6.<i>vue如何优化事件？</i></p>
        <p>vue在处理大列表绑定事件的时候，是有一定的性能问题的，框架内部没有把事件提到父节点上来做事件委托，
          唯一优化的是列表之间绑定的事件指向的函数都是同一个引用，且在dom销毁的时候能主动销毁事件，
          所以能负载一定的数据量，如果业务里的确存在非常大量的数据，建议还是自己在父节点上进行事件绑定，
          或者改变交互，进行分页。</p>
      </div>
      <h3>11.组件的 data 选项必须是一个函数</h3>
      <p>组件中的data写成一个函数，数据以函数返回值形式定义，这样每复用一次组件，就会返回一份新的data，
        类似于给每个组件实例创建一个私有的数据空间，让各个组件实例维护各自的数据。
        而单纯的写成对象形式，就使得所有组件实例共用了一份data，就会造成一个变了全都会变的结果。</p>
      <h3>12.动态组件</h3>
      <p>通过 Vue 的 component 元素加一个特殊的 is attribute 来实现：</p>
      <h3>13.vue.extend(options)</h3>
      <p>说明：使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。</p>
      <p>使用Vue.extend()创建的是Vue构造器，并不是一个组件实例，无法使用局部注册组件使用。</p>
      <p>使用：需要使用$mount(el)挂载到指定元素上</p>
      <p>使用场景：</p>
      <ol>
        <li>常用的组件模板，组件模板都是事先定义好的，如果我要从接口动态渲染组件怎么办？</li>
        <li>实现一个类似于 window.alert() 提示组件要求像调用 JS 函数一样调用它，该怎么办？</li>
      </ol>
      <h3>14.Vue.mixin(options)</h3>
      <p>说明：全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。</p>
      <p>混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。
        当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。</p>
      <p>
        <i>注：谨慎使用全局混入对象，因为会影响到每个单独创建的 Vue 实例 (包括第三方模板)。vue官方并不推荐在应用中使用使用mixin</i>
      </p>
      <p><i>关于选项合并：</i>当组件和混入对象含有同名选项时，这些选项将以恰当的方式混合。</p>
      <ol>
        <li>数据对象（data）在内部会进行递归合并，在和组件的数据发生冲突时以组件数据优先。</li>
        <li>同名钩子函数（created,mounted...）将混合为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。</li>
        <li>值为对象的选项（methods, components 和 directives）将被混合为同一个对象。两个对象键名冲突时，取组件对象的键值对。</li>
      </ol>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import BackHome from '../components/BackHome';
export default {
  name: 'aboutVue',
  props: {},
  components: {
    BackHome
  },
  data() {
    return {
      textStr1: '<my-component v-on:myEvent="doSomething"></my-component>',
      textStr2: '<my-component v-on:click.native="doSomething"></my-component>'
    };
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>

<style lang="less">
.about-vue {
  padding: 14px 24px;
  i {
    color: red;
  }
  .demo-wrp {
    h2,
    h3 {
      font-weight: 800;
    }
    .content-block {
      padding: 12px;
    }
    ol {
      li {
        list-style: decimal;
      }
    }
    ul {
      li {
        list-style-type: disc;
      }
    }
  }
}
</style>
