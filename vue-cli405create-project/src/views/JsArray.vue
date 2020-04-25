<style lang="less">
  .array-wrp{
    padding:14px 24px;
    i{
      color:red;
    }
    .demo-wrp{
      h2{
        font-weight: 800;
      }
      ol{
        li{
          list-style: decimal;
        }
      }
      ul{
        li{
          list-style-type: disc;
        }
      }
    }
  }
</style>
<template>
  <div class="array-wrp">
    <back-home></back-home>
    <div class="demo-wrp">
      <h2>一、数组的创建：</h2>
      <p>a.字面量：var cars = ['saab','volvo','bmw']</p>
      <p>b.使用关键词new：var cars = new Array('saab','volvo','bmw')</p>
      <p> <i>出于简洁、可读性和执行速度的考虑，请使用第一种方法</i> </p>
    </div>
    <div class="demo-wrp">
      <h2>二、访问数组元素</h2>
      <ol>
        <li>
          <p> <i>使用引用下标</i> </p>
          <p>var name = cars[0];</p>
        </li>
        <li>
          <p> <i>使用length访问最后一个元素</i> </p>
          <p>var name = cars[cars.length-1]</p>
        </li>
      </ol>
    </div>
    <div class="demo-wrp">
      <h2>三、如何识别数组</h2>
      <p>数组是对象</p>
      <p>数组是一种特殊类型的对象。在 JavaScript 中对数组使用 typeof 运算符会返回 "object"。</p>
      <ol>
        <li>
          <p>解决方案 1： <i>ECMAScript 5 定义了新方法 Array.isArray()：</i> 此方案的问题在于 ECMAScript 5 不支持老的浏览器。</p>
        </li>
        <li>
          <p>解决方案 2： <i>创建您自己的 isArray() 函数以解决此问题：</i> </p>
          <p>function isArray(x) {</p>
          <p>  return x.constructor.toString().indexOf("Array") > -1;</p>
          <p>}</p>
        </li>
        <li>
          <p>解决方案 3： <i>假如对象由给定的构造器创建，则 instanceof 运算符返回 true：</i> </p>
          <p>var fruits = ["Banana", "Orange", "Apple", "Mango"];</p>
          <p>console.log(fruits instanceof Array) // true</p>
        </li>
      </ol>
    </div>
    <div class="demo-wrp">
      <h2>四、数组方法</h2>
      <ol>
        <li>
          <p> <i>toString()</i> :把数组转换为数组值（逗号分隔）的字符串。</p>
        </li>
        <li>
          <p> <i>join()</i>:也可将所有数组元素结合为一个字符串。它的行为类似 toString()，但是您还可以规定分隔符 </p>
        </li>
        <li>
          <p> <i>pop()</i>:方法从数组中删除最后一个元素 </p>
          <p> <i>注</i>： </p>
          <p>1.pop() 方法返回“被弹出”的值</p>
          <p>2.此方法会改变原始数组</p>
        </li>
        <li>
          <p> <i>push()</i>：方法（在数组结尾处）向数组添加一个新的元素 </p>
          <p> <i>注</i>： </p>
          <p>1.push() 方法返回新数组的长度：</p>
          <p>2.此方法会改变原始数组</p>
        </li>
        <li>
          <p> <i>shift()</i>:方法会删除首个数组元素;并把所有其他元素“位移”到更低的索引。 </p>
          <p> <i>注</i>： </p>
          <p>shift() 方法返回被“位移出”的数组项</p>
          <p>2.此方法会改变原始数组</p>
        </li>
        <li>
          <p> <i>unshift()</i>：方法（在开头）向数组添加新元素；并“反向位移”旧元素 </p>
          <p> <i>注</i>： </p>
          <p>1.unshift() 方法返回新数组的长度。</p>
          <p>2.此方法会改变原始数组</p>
        </li>
        <li>
          <p> <i>delete</i>：删除数组元素</p>
          <p> <i>注</i>： </p>
          <p>使用 delete 会在数组对应位置留下未定义值undefind</p>
          <p>请使用 pop() 或 shift() 或 splice() 取而代之。</p>
        </li>
        <li>
          <p> <i>splice()</i>：有三种用法如下： </p>
          <p> <i>添加</i>：splice(index,0,item1,item2) </p>
          <p> <i>删除</i>：splice(index,1) </p>
          <p> <i>替换</i>：splice(index,1,item) </p>
        </li>
        <li>
          <p> <i>concat()</i>：方法通过合并（连接）现有数组来 <i>创建一个新数组----可以达到深度复制数组</i> </p>
          <p> <i>注</i>： </p>
          <p>concat() 方法不会更改现有数组。它总是返回一个新数组。var myChildren = myGirls.concat(myBoys);   // 连接 myGirls 和 myBoys</p>
          <p>concat() 方法可以使用任意数量的数组参数：var myChildren = arr1.concat(arr2, arr3);   // 将arr1、arr2 与 arr3 连接在一起</p>
        </li>
        <li>
          <p> <i>slice(start,end)</i>: 提取数组元素 <i>创建一个新数组----可以达到深度复制数组</i></p>
          <p> <i>注</i>： </p>
          <p>slice() 方法创建新数组。它不会从源数组中删除任何元素</p>
          <p>slice() 可接受两个参数;该方法会从开始参数选取元素，直到结束参数（不包括）为止。</p>
          <p>如果结束参数被省略，比如第一个例子，则 slice() 会切出数组的剩余部分。</p>
        </li>
        <li>
          <p> <i>toString()</i>:把数组转换为字符串 </p>
          <p> <i>注</i>： </p>
          <p>方法返回数组的字符串值，不会影响改变原数组</p>
        </li>
        <li>
          <p> <i>join()</i>：将使用指定字符分割数组转换为字符串 </p>
          <p> <i>注</i>： </p>
          <p>此方法不会改变原有数组</p>
        </li>
        <li>
          <p> <i>sort()</i>：方法以字母顺序对数组进行排序 </p>
          <p> <i>注</i>： </p>
          <p>默认地，sort() 函数按照字符串顺序对值进行排序。</p>
          <p>var fruits = ["Banana", "Orange", "Apple", "Mango"];</p>
          <p>fruits.sort();// Apple,Banana,Mango,Orange</p>
          <p>正因如此，sort() 方法在对数值排序时会产生不正确的结果。</p>
          <p>var points = [40, 100, 1, 5, 25, 10];</p>
          <p>points.sort() // 1,10,100,25,40,5</p>
          <p> <i>我们通过一个比值函数来修正此问题</i> </p>
          <p>points.sort(function(a, b){return a - b}); </p>
        </li>
        <li>
          <p> <i>reverse()</i> ：方法反转数组中的元素。</p>
        </li>
      </ol>
    </div>
    <div class="demo-wrp">
      <h2>五、数组迭代方法</h2>
      <ol>
        <li>
          <p> <i>Array.forEach()</i>:方法为每个数组元素调用一次函数（回调函数） </p>
        </li>
        <li>
          <p> <i>Array.map()</i>:方法通过对每个数组元素执行函数来创建新数组。 </p>
        </li>
        <li>
          <p> <i>Array.filter()</i>:方法创建一个包含通过测试的数组元素的新数组。 </p>
        </li>
        <li>
          <p> <i>Array.reduce()</i>:方法在每个数组元素上运行函数，以生成（减少它）单个值。 </p>
        </li>
        <li>
          <p> <i>Array.reduceRight()</i>:方法在每个数组元素上运行函数，以生成（减少它）单个值. </p>
        </li>
        <li>
          <p> <i>Array.every()</i>:方法检查所有数组值是否通过测试。 </p>
        </li>
        <li>
          <p> <i>Array.some()</i>:方法检查某些数组值是否通过了测试。 </p>
        </li>
        <li>
          <p> <i>Array.indexOf()</i>:方法在数组中搜索元素值并返回其位置。 </p>
        </li>
        <li>
          <p> <i>Array.lastIndexOf()</i>:Array.lastIndexOf() 与 Array.indexOf() 类似，但是从数组结尾开始搜索。 </p>
        </li>
        <li>
          <p> <i>Array.find()</i>:方法返回通过测试函数的第一个数组元素的值。 </p>
        </li>
        <li>
          <p> <i>Array.findIndex()</i>:方法返回通过测试函数的第一个数组元素的索引。 </p>
        </li>
      </ol>
    </div>
    <div class="demo-wrp">
      <h2>六、数组经典案例</h2>
      <ol>
        <li>
          <p> <i>以随机顺序排序数组</i> </p>
          <p>var points = [40, 100, 1, 5, 25, 10];</p>
          <p>points.sort(function(a, b){return 0.5 - Math.random()}); </p>
        </li>
        <li>
          <p> <i>查找最高（或最低）的数组值</i> </p>
          <p>var points = [40, 100, 1, 5, 25, 10];</p>
          <p>points.sort(function(a, b){return a - b});</p>
          <p>现在 points[0] 包含最低值</p>
          <p>而 points[points.length-1] 包含最高值</p>
        </li>
        <li>
          <p> <i>对数组使用 Math.max()</i>：来查找数组中的最高值 </p>
          <p>function myArrayMax(arr) {</p>
          <p>return Math.max.apply(null, arr);</p>
          <p>}</p>
        </li>
        <li>
          <p> <i>对数组使用 Math.min()</i>：来查找数组中的最低值 </p>
          <p>function myArrayMax(arr) {</p>
          <p>return Math.min.apply(null, arr);</p>
          <p>}</p>
        </li>
      </ol>
    </div>
  </div>
</template>
<script>
import BackHome from '../components/BackHome';
export default {
  name: 'JsArray',
  props: {},
  data() {
    return {
      testArr: ['a', 'b', 'c', 'd']
    };
  },
  computed: {},
  components: {
    BackHome
  },
  watch: {},
  methods: {
    consoleMethod() {
      const testSlice = this.testArr.slice(1, 2);
      console.log(testSlice);
      console.log(this.testArr);
      const stringArr = this.testArr.toString();
      console.log(stringArr);
      console.log(this.testArr);
      const joinStr = this.testArr.join('#');
      console.log(joinStr);
      console.log(this.testArr);
    }
  },
  created() {},
  mounted() {
    this.consoleMethod();
  },
  updated() {},
  beforeDestroy() {}
};
</script>
