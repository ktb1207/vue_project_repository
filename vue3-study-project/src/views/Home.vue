<template>
  <div class="home router-page">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <h3>vue3.0学习笔记</h3>
    <h5>一、Vue3.0亮点概括：</h5>
    <ul>
      <li>
        <h6>Performance: 性能比Vue 2.x快1.2~2倍</h6>
        <p><i>Vue3.0是如何变快的???</i></p>
        <ol>
          <li>
            <h6>diff方法优化:Vue 3.0，新增了静态标记（PatchFlag）</h6>
            <p>
              Vue 2.x 中的虚拟 DOM 是全量对比的模式，而到了 Vue 3.0 开始，新增了静态标记（PatchFlag）。
            </p>
            <p>
              在更新前的节点进行对比的时候，只会去对比带有静态标记的节点。并且 PatchFlag 枚举定义了十几种类型，用以更精确的定位需要对比节点的类型。
            </p>
            <p>
              在 Vue 3.0 中，对 diff 算法进行了优化，在创建虚拟 DOM 时，根据 DOM 内容是否会发生变化，而给予相对应类型的静态标记（PatchFlag）
            </p>
          </li>
          <li>
            <h6>hoistStatic(静态提升)</h6>
            <p><i>什么是静态提升？</i></p>
            <p>我们平时在开发过程中写函数的时候，定义一些写死的变量时，都会将变量提升出去定义</p>
            <p>如果将变量定义在函数方法内，每次调用函数都会重新定义一次变量</p>
            <p><i>Vue 3.0 在这方面也做了同样的优化</i></p>
            <p>静态节点会被提取到render函数外，每次渲染时候只要取静态变量即可，静态变量同时会被打上PatchFlag静态标记</p>
          </li>
          <li>
            <h6>cacheHandler(事件监听缓存)</h6>
            <p><i>如何理解事件监听缓存？</i></p>
            <p>
              默认情况下 @click 事件被认为是动态变量，所以每次更新视图的时候都会追踪它的变化。 但是正常情况下，我们的 @click
              事件在视图渲染前和渲染后，都是同一个事件，基本上不需要去追踪它的变化， 所以 Vue 3.0 对此作出了相应的优化叫事件监听缓存
            </p>
          </li>
        </ol>
      </li>
      <li>
        <h6>Tree-shaking support</h6>
        <p>vue3中的核心api都支持了tree-shaking，这些api都是通过包引入的方式而不是直接在实例化时就注入，只会对使用到的功能或特性进行打包（按需打包）</p>
        <p>如：vue.nextTick,vue.set,vue.delete等全局api都需要按需引入使用</p>
      </li>
      <li>
        <h6>Composition API: 组合API(类似React Hooks)</h6>
        <p><i>有哪些优势？</i></p>
        <ol>
          <li>vue2.0中options api主要存在--数据和业务逻辑分散，不利于管理维护</li>
          <li>vue3.0中Componsition api可以抽离业务逻辑，利于之后的管理和维护</li>
          <li>
            <p><i>理解Componsition api的本质</i></p>
            <p>Composition API的本质就是在运行的时候将暴露出去的数据注入到option api中，如将数据注入到data中，将方法注入到methods中。</p>
          </li>
        </ol>
      </li>
      <li>
        <h6>Better TypeScript support：更优秀的 Ts 支持</h6>
      </li>
      <li>
        <h6>Custom Renderer API：暴露了自定义渲染API</h6>
        <p><i>待后期继续了解。。。</i></p>
      </li>
      <li>
        <h6>更先进的组件：Fragment, Teleport, Suspense</h6>
        <ol>
          <li>
            <h6>Fragment</h6>
            <p>vue2.0里template只支持单一根节点，在vue3.0里可以使用多个根节点,或者使用Fragment 空标签</p>
          </li>
          <li>
            <h6>Teleport</h6>
            <p>Teleport 提供了一种干净的方法，允许我们控制在 DOM 中哪个父节点下呈现 HTML</p>
          </li>
          <li>
            <h6>Suspense</h6>
            <p>它们允许我们的应用程序在等待异步组件时渲染一些后备内容，可以让我们创建一个平滑的用户体验。主要在定义异步组件(defineAsyncComponent)结合使用</p>
          </li>
        </ol>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
};
</script>
