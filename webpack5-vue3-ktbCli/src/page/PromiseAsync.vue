<template>
  <div class="promise-wrp">
    <h3 class="center-text">promise/async用法总结</h3>
    <p class="title">1.背景</p>
    <hr />
    <p>
      在项目开发过程中，有时候会对promise和async的用法出现模糊不清的部分，这篇文章将深入总结二者的用法，以求清晰，加深理解
    </p>
    <p class="title">2.关于Promise</p>
    <hr />
    <p>Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大.</p>
    <p>Promise特点：</p>
    <ul>
      <li>Promise 新建后就会立即执行。</li>
      <li>对象的状态不受外界影响</li>
      <li>一旦状态改变，就不会再变</li>
    </ul>
    <p class="tips">Promise缺点：</p>
    <ul>
      <li>无法取消Promise，一旦新建它就会立即执行，无法中途取消</li>
      <li>其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部</li>
      <li>当处于pending状态时，无法得知目前进展到哪一个阶段</li>
    </ul>
    <p class="title">3.关于Async/await</p>
    <hr />
    <p>特点</p>
    <ul>
      <li>async函数返回一个 Promise 对象</li>
      <li>async函数内部return语句返回的值，会成为then方法回调函数的参数</li>
      <li>async函数内部抛出错误，会导致返回的 Promise 对象变为reject状态</li>
      <li>
        async函数返回的 Promise 对象，必须等到内部所有await命令后面的 Promise
        对象执行完，才会发生状态改变，除非遇到return语句或者抛出错误
      </li>
      <li>
        正常情况下，await命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。
      </li>
      <li>任何一个await语句后面的 Promise 对象变为reject状态，那么整个async函数都会中断执行。</li>
      <li>
        为了不使某一个await后面的Promise对象操作失败而影响整个async函数后面的操作，可以将await放在try...catch结构；另一种方法是await后面的
        Promise 对象再跟一个catch方法，处理前面可能出现的错误。
      </li>
      <li>async函数里面存在多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。</li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
  setup() {
    /**
     * Promise是一个构造函数
     *
     * Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数。
     *
     * 如果调用resolve函数和reject函数时带有参数，那么它们的参数会被传递给回调函数。
     *
     * resolve函数的参数除了正常的值以外，还可能是另一个 Promise 实例
     *
     * 例子1 resolve参数为普通值
     * */
    function delayConsole(msg, ms) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          res(msg);
        }, ms);
      });
    }
    // 例子2
    function p1() {
      return new Promise((res, rej) => {
        setTimeout(() => {
          rej('error');
        }, 3000);
      });
    }
    // 例子2
    function p2() {
      return new Promise((res, rej) => {
        setTimeout(() => {
          res(p1());
        }, 1000);
      });
    }

    // 例子3
    function pThen() {
      return new Promise((res, rej) => {
        setTimeout(() => {
          res('demo3');
        }, 5000);
      });
    }
    // async //
    function as1() {
      return new Promise((res, rej) => {
        setTimeout(() => {
          console.log('await1 runing');
          res('as1 success');
        }, 2000);
      });
    }
    function as2() {
      return new Promise((res, rej) => {
        setTimeout(() => {
          console.log('await2 runing');
          res('as2 success');
        }, 5000);
      });
    }
    async function asyncOneFn() {
      console.log('-- async--start');
      const rest1 = await as1(); // await 的返回值是后面promise resolve的结果
      console.log(rest1);
      const rest2 = await as2();
      console.log('--async--end--');
      return 'async then runing';
    }
    onMounted(() => {
      // ---------demo1
      // delayConsole('hello promise', 2000).then((res) => console.log(res));
      // p2函数的res参数调用p1()返回一个promise对象
      // 这时p1的状态就会传递给p2，也就是说，p1的状态决定了p2的状态。
      // 如果p1的状态是pending，那么p2的回调函数就会等待p1的状态改变；
      // 如果p1的状态已经是resolved或者rejected，那么p2的回调函数将会立刻执行。
      // ---------demo2
      // p2()
      //   .then((res) => console.log(res))
      //   .catch((err) => console.log(err));
      // ----------demo3
      // then()方法返回一个新promise实例，因此可以采用链式写法，即then方法后面再调用另一个then方法
      // then()方法的return值将作为后面一个then的参数
      // pThen()
      //   .then((res) => {
      //     console.log(res);
      //     return res + 'then方法返回一个新的Promise实例，因此可以采用链式写法，即then方法后面再调用另一个then方法';
      //   })
      //   .then((res) => {
      //     console.log(res);
      //   });
      // ---------demo4
      // then() 方法返回值为另一个Promise,这时候后面的then()方法，将会等待该promise对象的状态发生变化，才会被调用
      // pThen()
      //   .then((res) => {
      //     console.log(res + 'then返回一个新的promise');
      //     return new Promise((r, j) => {
      //       setTimeout(() => {
      //         r('new promise success');
      //       }, 8000);
      //     });
      //   })
      //   .then((res) => {
      //     console.log(res);
      //   });
      // async demo

      asyncOneFn().then((res) => console.log(res));
    });
  }
});
</script>

<style lang="scss">
.promise-wrp {
  .center-text {
    text-align: center;
  }
  .title {
    color: green;
    font-size: 18px;
  }
  .tips {
    color: red;
    font-size: 18px;
  }
}
</style>
