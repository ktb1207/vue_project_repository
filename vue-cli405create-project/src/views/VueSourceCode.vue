<style lang="less">
.source-code-wrp {
  padding: 14px 24px;
  i {
    color: red;
  }
  .demo-wrp {
    h2 {
      font-weight: 800;
    }
    ol {
      li {
        list-style: decimal;
        text-indent: 24px;
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

<template>
  <div class="source-code-wrp">
    <back-home></back-home>
    <div class="demo-wrp">
      <h2>vue源码解析理解汇总：</h2>
    </div>
    <div class="demo-wrp">
      <h2>一、new Vue()，vue是什么？</h2>
      <ol>
        <li>
          <p>
            vue 的源码定义是使用function Vue(options)函数定义，而没有采用es6 class类来
            定义，因为这样可以方便的把vue的功能拆分到不同的目录中去维护。
          </p>
          <p>
            当执行new Vue时，内部会执行一个方法 this._init(options)，将初始化的参数传入。
            在vue的内部，_符号开头定义的变量是供内部私有使用的，而$ 符号定义的变量是供用户使用的，
            而且用户自定义的变量不能以_或$开头，以防止内部冲突。
          </p>
        </li>
        <li>
          <p>
            vue版本:分为完整版和运行时版本
          </p>
          <p>
            在vue的内部是只认render函数,可能有人会纳闷了，既然只认render函数，同时我们开发好像从来并没有写过render函数，
            而是使用的template模板。这是因为有vue-loader，它会将我们在template内定义的内容编译为render函数，
            而这个编译就是区分完整版和运行时版本的关键所在，完整版就自带这个编译器，而运行时版本就没有
          </p>
          <p>
            vue-cli默认是使用运行时版本的。完整版和运行时版本主要是两点不同：
          </p>
          <p>
            a.最明显的就是大小的区别，带编译器会比不带的版本大6kb。
          </p>
          <p>
            b.编译的时机不同，编译器是运行时编译，性能会有一定的损耗；运行时版本是借助loader做的离线编译，运行性能更高。
          </p>
        </li>
      </ol>
    </div>
    <div class="demo-wrp">
      <h2>二、new Vue()时到底做了什么</h2>
      <ol>
        <li>
          <p>
            <i>合并options配置:</i>
          </p>
          <p>
            在执行new Vue构造函数时，参数就是一个对象，也就是用户的自定义配置；
            会将它和vue之前定义的原型方法，全局API属性；还有全局的Vue.mixin内的参数，
            将这些都合并成为一个新的options，最后赋值给一个的新的属性$options。
          </p>
        </li>
        <li>
          <p>
            <i>initLifecycle(vm): </i>
          </p>
          <p>主要作用是确认组件的父子关系和初始化某些实例属性。</p>
        </li>
        <li>
          <p>
            <i> initEvents(vm): </i>
          </p>
          <p>
            作用是将父组件在使用v-on或@注册的自定义事件添加到子组件的事件中心中。
          </p>
          <p>在vue中事件分为两种:原生事件和自定义事件</p>
          <p>
            在执行initEvents之前的模板编译阶段，会判断遇到的是html标签还是组件名，
            如果是html标签会在转为真实dom之后使用addEventListener注册浏览器原生事件</p>
        </li>
        <li>
          <p><i>initRender(vm):</i></p>
          <p>主要作用是挂载可以将render函数转为vnode的方法</p>
        </li>
        <li>
          <p><i>callHook(vm, 'beforeCreate'):</i></p>
          <p>执行实例的第一个生命周期钩子beforeCreate</p>
        </li>
        <li>
          <p><i>initInjections(vm):</i></p>
          <p>
            主要作用是初始化inject，可以访问到对应的依赖。
          </p>
        </li>
        <li>
          <p><i>initState(vm): </i></p>
          <p>初始化会被使用到的状态，状态包括props，methods，data，computed，watch五个选项。</p>
          <p>7.1、initProps (vm, propsOptions)：检测子组件接受的值是否符合规则，以及让对应的值可以用this直接访问</p>
          <p>7.2、initMethods (vm, methods)：作用是将methods内的方法挂载到this下。</p>
          <p><i>请问methods内的方法可以使用箭头函数么，会造成什么样的结果？</i></p>
          <p>答：不可以使用箭头函数的，因为箭头函数的this是定义时就绑定的
            在vue的内部，methods内每个方法的上下文是当前的vm组件实例，而如果使用使用箭头函数，
            函数的上下文就变成了父级的上下文，也就是undefined了，
            结果就是通过undefined访问任何变量都会报错。
          </p>
          <p>7.3、initData (vm)：作用是初始化data，完成数据响应式观测。</p>
        </li>
        <li>
          <p><i>initProvide(vm):</i></p>
          <p>主要作用是初始化provide为子组件提供依赖。</p>
        </li>
        <li>
          <p><i>callHook(vm, 'created'): </i></p>
          <p>执行用户定义的created钩子函数</p>
        </li>
      </ol>
    </div>
    <div class="demo-wrp">
      <h2>三、虚拟Dom是怎么创建的？</h2>
      <p>vue内部使用vm._render()方法来创建虚拟dom,vm_createElement转化VNode是分为两种情况的：</p>
      <p><i>普通的元素节点转化为VNode:</i></p>
      <p>通过vnode = new VNode(tag, data, children)来递归创建虚拟dom</p>
      <p><i>组件转化为VNode:</i></p>
      <p>通过调用vnode = createComponent()来创建虚拟dom</p>
    </div>
    <div class="demo-wrp">
      <h2>四、虚拟dom如何到真实dom？</h2>
      <p>说明：</p>
      <p>在执行完了vm._render方法拿到了VNode，现在将它作为参数传给vm._update方法并执行。
        vm._update这个方法的作用就是就是将VNode转为真实的Dom
      </p>
      <p><i>方法vm._update()它有两个执行的时机：</i></p>
      <ol>
        <li>
          <p><i>首次渲染:</i></p>
          <p>
            当执行new Vue到此时就是首次渲染了，会将传入的VNode对象映射为真实的Dom
          </p>
        </li>
        <li>
          <p><i>更新页面:</i></p>
          <p>
            数据变化会驱动页面发生变化，这也是vue最独特的特性之一，
            数据改变之前和之后会生成两份VNode,通过对前后两份vnode进行diff算法，
            在旧的VNode上做最小的改动去渲染页面。
          </p>
        </li>
        <li>
          <p><i>VNode生成真实的Dom的方式还是分为元素节点和组件两种方式：</i></p>
          </p>
          <p>
            3.1元素节点生成Dom:createElm()方法用于将元素节点vnode生成真实的Dom
          </p>
          <p>
            依次判断是否是元素节点、注释节点、文本节点，分别创建它们然后插入到父节点里面,
            如果是元素节点，即同时创建子节点：createChildren(),在createChildren()内部递归
            调用createElm()创建元素节点
          </p>
          <p><i>由里向外的挨个创建出真实的Dom</i></p>
          <p>3.2组件VNode生成Dom:createComponent()方法用于将组件vnode生成真实dom</p>
          <p>组件vnode生成dom也是一个由里及外的过程。</p>
        </li>
        <li>
          <p>问：</p>
          <p>父子两个组件同时定义了beforeCreate、created、beforeMounte、mounted四个钩子，它们的执行顺序是怎么样的？</p>
          <p>答：</p>
          <p>首先会执行父组件的初始化过程，所以会依次执行beforeCreate、created、在执行挂载前又会执行beforeMount钩子，
            不过在生成真实dom的__patch__过程中遇到嵌套子组件后又会转为去执行子组件的初始化钩子beforeCreate、created，
            子组件在挂载前会执行beforeMounte，再完成子组件的Dom创建后执行mounted。
            这个父组件的__patch__过程才算完成，最后执行父组件的mounted钩子，这就是它们的执行顺序</p>
        </li>
      </ol>
    </div>
    <div class="demo-wrp">
      <h2>五、关于diff算法理解：</h2>
      <p>说明：</p>
      <p>1.diff只会在同层级进行, 不会跨层级比较。</p>
      <p>2.diff的过程就是调用patch(oldVnode,vnode)函数,函数接收两个参数，一个是旧的虚拟dom,
        一个是当前新的虚拟dom
      </p>
      <p><i>diff过程分析：</i></p>
      <ol>
        <li>
          <p><i>首先会看这两个节点是否值得比较：</i></p>
          <p>依据：vnode.key === oldVnode.key && vnode.el === oldVnode.el</p>
          <p>依据虚拟dom的key和el-对应真实dom的引用来进行判断。</p>
        </li>
        <li>
          <p><i>当节点不值得比较:</i></p>
          <p>取得oldvnode.el的父节点</p>
          <p>为vnode创建它的真实dom</p>
          <p>将新的dom插入，移除旧的dom</p>
        </li>
        <li>
          <p><i>两个节点值得比较时:</i>patchVnode (oldVnode, vnode)</p>
          <p>if (oldVnode === vnode)，他们的引用一致，可以认为没有变化。直接返回</p>
          <p>if(oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text)，文本节点的比较，
            需要修改，则会调用Node.textContent = vnode.text。
          </p>
          <p>if( oldCh && ch && oldCh !== ch ), 两个节点都有子节点，而且它们不一样，
            这样我们会调用updateChildren函数比较子节点
          </p>
          <p>只有新的节点有子节点，调用createEle(vnode)，vnode.el已经引用了老的dom节点，createEle函数会在老dom节点上添加子节点。</p>
          <p>新节点没有子节点，老节点有子节点，直接删除老节点。</p>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import BackHome from '../components/BackHome';
export default {
  name: 'vueSourceCode',
  props: {},
  data() {
    return {};
  },
  computed: {},
  components: {
    BackHome
  },
  watch: {},
  methods: {},
  mounted() {}
};
</script>