<style lang="less">
  .number-wrp{
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
  <div class="number-wrp">
    <back-home></back-home>
    <div class="demo-wrp">
      <h2>一、关于Number</h2>
      <p>Number类型表示数字，JavaScript 采用“IEEE 754 标准定义的双精度64位格式”（"double-precision 64-bit format IEEE 754 values"）表示数字。</p>
      <p>和其他编程语言（如 C 和 Java）不同， <i>JavaScript 不区分整数值和浮点数值，</i> 所有数字在 JavaScript 中均用浮点数值表示,</p>
      <p>所以在进行数字运算的时候要特别注意 <i>精度缺失</i> 问题。</p>
      <p>例：console.log(0.1 + 0.2)// 0.30000000000000004</p>
      <p> <i>可以采用使用乘除法解决此问题：</i> </p>
      <p> <i>var x = (0.2 * 10 + 0.1 * 10) / 10;       // x 将是 0.3</i> </p>
    </div>
    <div class="demo-wrp">
      <h2>二、Number的创建</h2>
      <ol>
        <li>var aNum = 123</li>
        <li>var bNum = new Number(123)</li>
      </ol>
      <p> <i>注</i>：请不要创建数值对象。这样会拖慢执行速度。 </p>
    </div>
    <div class="demo-wrp">
      <h2>三、不同进制的表示方法</h2>
      <p>Number可以使用四种数字进制：十进制，二进制，八进制和十六进制。</p>
      <ul>
        <li>二进制表示法：以零为开头，后面接一个小写或大写的拉丁文字母B(0b或者是0B) // var a = 0b100000; // 32</li>
        <li>八进制表示法：以0为开头的。假如0后面的数字不在0到7的范围内，该数字将会被转换成十进制数字。// var n = 0755; // 493</li>
        <li>十六进制表示法：以零为开头，后面接一个小写或大写的拉丁文字母X(0x或者是0X) // 0x123456789ABCDEF   // 81985529216486900</li>
        <li> 注：<i>在ECMAScript 5 严格模式下禁止使用八进制语法，会被视为十进制</i> </li>
      </ul>
    </div>
    <div class="demo-wrp">
      <h2>四、不同进制的转换</h2>
      <p>进制的转换主要用到Number的toString()方法或parseInt()方法：</p>
      <ul>
        <li>
          <p>toString() 方法接受一个值为 2~36 之间的整数参数指定进制，默认为十进制， <i>将Number转为String</i></p>
          <p>var n = 120;</p>
          <p>n.toString(); // "120"</p>
          <p>n.toString(2); // "1111000"</p>
        </li>
        <li>
          <p>parseInt() 第二个参数接受一个值为 2~36 之间的整数参数指定进制，默认为十进制， <i>将String转为Number</i></p>
          <p>parseInt('110'); // 110</p>
          <p>parseInt('110', 8);  // 72</p>
        </li>
      </ul>
    </div>
    <div class="demo-wrp">
      <h2>五、Number方法：</h2>
      <ol>
        <li> <i>Number.parseFloat()</i>: 把字符串参数解析成浮点数</li>
        <li> <i>Number.parseInt()</i>: 把字符串解析成特定基数对应的整型数字</li>
        <li> <i>Number.isFinite()</i>: 判断传递的值是否为有限数字</li>
        <li> <i>Number.isInteger()</i>: 判断传递的值是否为整数</li>
        <li> <i>Number.isNaN()</i>: 判断传递的值是否为 NaN</li>
        <li> <i>Number.toFixed()</i>: 返回字符串值，它包含了指定位数小数的数字</li>
      </ol>
    </div>
    <div class="demo-wrp">
      <h2>六、如何判断是否为数字</h2>
      <ol>
        <li>
          <p><i>使用isNaN()函数</i> :isNaN()的缺点就在于 null、空格以及空串会被按照0来处理</p>
          <p> <i>**</i> isNaN()函数来判断一个值是数字的最正确的方法就是：</p>
          <p>function myIsNaN(value) {</p>
          <p>return typeof value === 'number' && !isNaN(value);</p>
          <p>}</p>
        </li>
        <li>
          <p> <i>使用正则表达式</i> </p>
          <p>见this.isNumber()</p>
        </li>
      </ol>
    </div>
    <div class="demo-wrp">
      <h2>七、如何判断是否为整数</h2>
      <p> <i>Number.isInteger()</i> </p>
    </div>
    <div class="demo-wrp">
      <h2>八、parseFloat()/parseInt/Number()三者的使用区别：</h2>
      <ol>
        <li>
          <p> <i>parseInt</i>:从左到右检测字符串，若能先检测到数字，则将数字转换成整形，否则返回NaN。 </p>
          <p>console.log(parseInt(true)) // NaN</p>
          <P>console.log(parseInt('123ac')) // 123</P>
          <P>console.log(parseInt('ac12')) // NaN</P>
        </li>
        <li>
          <p> <i>parseFloat</i>: 从左到右检测字符串，若能先检测到数字，则将数字转换成浮点型，否则返回NaN。</p>
          <p>console.log(parseFloat(true)) // NaN</p>
          <p>console.log(parseFloat('a23.12.45')) // NaN</p>
          <P>console.log(parseFloat('123.ac.45')) // 123</P>
          <P>console.log(parseFloat('123.12.45')) // 123.12</P>
        </li>
        <li>
          <p> <i>Number</i>:若字符串中含有其他字符则返回NaN. </p>
          <p>console.log(Number('12a')) // NaN</p>
          <P>console.log(Number(true)) // 1</P>
          <P>console.log(Number(false)) // 0</P>
          <p>console.log(Number('')) // 0</p>
        </li>
      </ol>
    </div>
  </div>
</template>
<script>
import BackHome from '../components/BackHome';
export default {
  name: 'JsNumber',
  props: {},
  data() {
    return {
    };
  },
  computed: {},
  components: {
    BackHome
  },
  watch: {},
  methods: {
    /**
    * 校验只要是数字（包含正负整数，0以及正负浮点数）就返回true
    **/
    isNumber(val) {
      var regPos = /^\d+(\.\d+)?$/; // 非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
      if (regPos.test(val) && regNeg.test(val)) {
        return true;
      }
      return false;
    }
  },
  created() {},
  mounted() {},
  updated() {},
  beforeDestroy() {}
};
</script>
