<template>
  <div class="error-wrp">
    <h3 class="center-text">关于js错误处理机制分析</h3>
    <p class="title">1.背景</p>
    <p>良好的错误处理机制可以让用户及时得到提醒，知道到底发生了什么事，因而不会惊慌失措</p>
    <p>为此，作为开发人员，我们必须理解在处理JavaScript错误的时候，都有哪些手段和工具可以利用</p>
    <p class="title">2.潜在错误的风险危害</p>
    <p>
      在ES3之前js代码执行的过程中，一旦出现错误，整个js代码都会停止执行，这样就显的代码非常的不健壮。从ES3开始，js也提供了类似的错误处理机制，从而让js代码变的更健壮
    </p>
    <p class="title">3.JavaScript 中的错误是什么</p>
    <p>JavaScript中的错误是一个对象。要在 JS 创建一个错误，可以使用 Error 对象</p>
    <p>const err = new Error('霍霍，好像哪里出问题了！')</p>
    <p>也可以省略new关键字:const err = Error('霍霍，好像哪里出问题了！')</p>
    <p>创建，错误对象有三个属性：</p>
    <ul>
      <li>message:带有错误消息的字符串</li>
      <li>name：错误的类型</li>
      <li>stack：函数执行的堆栈跟踪</li>
    </ul>
    <p class="title">4.JavaScript中的许多类型的错误</p>
    <ul>
      <li>Error</li>
      <li>EvalError: eval错误</li>
      <li>InternalError</li>
      <li>RangeError: 范围错误</li>
      <li>ReferenceError: 引用错误</li>
      <li>SyntaxError: 语法错误</li>
      <li>TypeError: 类型错误</li>
      <li>URIError: URI错误</li>
    </ul>
    <p>记住，所有这些错误类型都是实际的构造函数，意味着返回一个新的错误对象。</p>
    <p>例如，我们使用 TypeError 对象创建一个错误，对应的 message 是创建的传入的字符号，name 是 "TypeError"</p>
    <p>const wrongType = TypeError("霍霍，好像哪里出问题了！")</p>
    <p>wrongType.message // "霍霍，好像哪里出问题了！"</p>
    <p>wrongType.name // "TypeError"</p>
    <p class="title">5.从技术上讲，JavaScript中可以抛出任何东西，而不仅仅是错误对象</p>
    <p>throw Symbol();</p>
    <p>throw 33;</p>
    <p>throw "Error!";</p>
    <p>throw null;</p>
    <p>但是，最好避免这些事情：始终抛出正确的错误对象，而不是一些基本类型。</p>
    <p>
      这样有助于在代码中，错误处理的一致性。 其他成员可以期望在错误对象上访问error.message或error.stack
      来知道错误的源头。
    </p>
    <p class="title">6.当我们抛出异常时会发生什么？</p>
    <p>异常就像一个上升的电梯:一旦你抛出一个，它就会在程序堆栈中冒泡，除非它在某个地方被捕获。</p>
    <p>任何没有通过try-catch处理的错误都会触发window对象的error事件</p>
    <p>error事件可以接收三个参数：错误消息、错误所在的URL和行号。</p>
    <p>要指定onerror事件处理程序，可以使用DOM0级技术，也可以使用DOM2级事件的标准格式</p>
    <textarea cols="80" rows="10">
      //DOM0级
      window.onerror = function(message,url,line){
          alert(message);
      }
      //DOM2级
      window.addEventListener("error",function(message,url,line){
          alert(message);
      });
    </textarea>
    <p>如果异常未被捕获，也就是说，程序员不采取任何措施来捕获它，程序将崩溃。</p>
    <p class="title">7.JavaScript 同步和异步中的错误和异常处理</p>
    <p class="title">8.同步中的错误处理</p>
    <p>同步代码在大多数情况下都很简单，因此它的错误处理也很简单。</p>
    <p>要捕获同步函数引发的异常，我们可以使用try/catch/finally：</p>
    <p>9.异步中的错误处理</p>
    <p>JavaScript本质上是同步的，是一种单线程语言。</p>
    <p>浏览器中异步操作有：定时器相关的函数、事件和 Promise。</p>
    <p>例子：</p>
    <textarea rows="14" cols="80">
      function failAfterOneSecond() {
      setTimeout(() => {
        throw Error("Something went wrong!");
      }, 1000);
      }

      try {
        failAfterOneSecond();
      } catch (error) {
        console.error(error.message);
      }
    </textarea>
    <p>
      try/catch 是同步，而 setTimeout 是异步的。当执行到 setTimeout回调时，try/catch 早已跑完了，所以异常就无法捕获到
    </p>
    <p>
      如果能让程序跑下去，把 try/catch 移动到 setTimeout 里面。但这种做法意义不大，后面我们会使用 Promise
      来解决这类的问题。
    </p>
    <p class="title">10.事件中错误处理</p>
    <p>DOM 的事件操作（监听和触发），都定义在EventTarget接口。</p>
    <p>Element节点、document节点和window对象，都部署了这个接口</p>
    <p>此外，XMLHttpRequest、AudioNode、AudioContext等浏览器内置对象，也部署了这个接口</p>
    <p>该接口就是三个方法，addEventListener和removeEventListener用于绑定和移除监听函数，dispatchEvent用于触发事件</p>
    <p>DOM 事件的错误处理机制遵循任何异步Web API的相同方案。</p>
    <p>例子</p>
    <p>在这里，单击按钮后立即引发异常。 我们如何抓住它？ 下面这种方式没啥作用，也不会阻止程序崩溃：</p>
    <textarea rows="14" cols="80">
      const button = document.querySelector("button");
      try {
        button.addEventListener("click", function() {
          throw Error("Can't touch this button!");
        });
      } catch (error) {
        console.error(error.message);
      }
    </textarea>
    <p>与 setTimeout 一样，addEventListener 也是异步执行的。</p>
    <p>
      如果能让程序跑下去，把 try/catch 移动到 addEventListener 里面。但这种做法意义不大，后面我们会使用 Promise
      来解决这类的问题。
    </p>
    <p class="title">11.使用 Promise 处理错误</p>
    <p>为了演示 Promise 处理方式，我们先回到一开始的那个事例：</p>
    <p>相对简单抛出异常，我们可以使用 Promise.reject 和Promise.resolve:</p>
    <textarea rows="14" cols="80">
      function toUppercase(string) {
        if (typeof string !== "string") {
          return Promise.reject(TypeError("Wrong type given, expected a string"));
        }

        const result = string.toUpperCase();

        return Promise.resolve(result);
      }
    </textarea>
    <p>因为使用了 Promise ，所以可以使用 then 来接收返回的内容，或者用 catch 来捕获出现的错误。</p>
    <p>toUppercase(99).then(result => result).catch(error => console.error(error.message))</p>
    <p class="title">12.Promise, error, 和 throw</p>
    <p>使用 Promise.reject 可以很方便的抛出错误：</p>
    <p>Promise.reject(TypeError("Wrong type given, expected a string"));</p>
    <p>除了Promise.reject，我们也可以通过抛出异常来退出 Promise。</p>
    <p>例子：要停止异常传播，我们照常使用catch：</p>
    <textarea rows="10" cols="80">
      Promise.resolve("A string")
      .then(value => {
        if (typeof value === "string") {
          throw TypeError("Expected a number!");
        }
      })
      .catch(reason => console.log(reason.message));
    </textarea>
    <p class="title">13.使用 Promise 来处理定时器中的异常</p>
    <p>例子：</p>
    <textarea rows="10" cols="80">
      function failAfterOneSecond() {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(Error("Something went wrong!"));
          }, 1000);
        });
      }
      // 此时，我们可以使用catch处理异常:
      failAfterOneSecond().catch(reason => console.error(reason.message));
    </textarea>
    <p class="title">14.使用 async/await 来处理错误</p>
    <p>
      只要在函数前面加上async，该函数就会返回一个Promise。这意味着我们可以在函数调用之后进行then、catch和finally 操作
    </p>
    <p>例子：</p>
    <textarea rows="14" cols="80">
      async function toUppercase(string) {
        if (typeof string !== "string") {
          throw TypeError("Wrong type given, expected a string");
        }

        return string.toUpperCase();
      }

      toUppercase("abc")
        .then(result => console.log(result))
        .catch(error => console.error(error.message))
        .finally(() => console.log("Always runs!"));
    </textarea>
    <p>当从 async 函数抛出异常时，我们就可以使用 catch 来捕获。</p>
    <p>最重要的是，除了这种方式外，我们可以还使用try/catch/finally，就像我们使用同步函数所做的一样。</p>
    <textarea rows="22" cols="80">
      async function toUppercase(string) {
        if (typeof string !== "string") {
          throw TypeError("Wrong type given, expected a string");
        }

        return string.toUpperCase();
      }

      async function consumer() {
        try {
          await toUppercase(98);
        } catch (error) {
          console.error(error.message);
        } finally {
          console.log("Always runs!");
        }
      }

      consumer(); 
    </textarea>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    // throw new Error('hello error'); // 会阻止程序执行
  }
});
</script>

<style lang="scss">
.error-wrp {
  .center-text {
    text-align: center;
  }
  .title {
    color: green;
    font-size: 18px;
  }
}
</style>
