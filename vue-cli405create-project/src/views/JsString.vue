<style lang="less">
  .string-demo{
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
  <div class="string-demo">
    <back-home></back-home>
    <div class="demo-wrp">
      <h2>关于javascript的使用总结：</h2>
    </div>
    <div class="demo-wrp">
      <h2>一、关于创建字符串方式及区别：<i>var a = 'tom';var b = new String('tom')</i></h2>
      <ol>
        <li>
          <div>
            <p>区别：</p>
            <p>console.log(typeof a)：<i>string</i></p>
            <p>console.log(typeof b): <i>object</i></p>
            <p>console.log(a == b): <i>true</i> 当使用 == 相等运算符时，相等字符串是相等的</p>
            <p>console.log(a === b): <i>false</i>当使用 === 运算符时，相等字符串是不相等的，因为 === 运算符需要类型和值同时相等。</p>
          </div>
          <p><i>请不要把字符串创建为对象。它会拖慢执行速度。</i></p>
        </li>
      </ol>
    </div>
    <div class="demo-wrp">
      <h2>二、字符串常用方法</h2>
      <ol>
        <li>
          <p>获取字符串长度：<i>length</i></p>
          <p>var aString = 'welcome to beijing funny!';console.log(aString.length) // 25</p>
        </li>
        <li>
          <p>查找字符串中的字符串：<i>indexOf()和lastIndexOf()</i> </p>
          <p>indexOf() 方法返回字符串中指定文本<i>首次</i>出现的索引（位置）</p>
          <p>lastIndexOf() 方法返回指定文本在字符串中<i>最后</i>一次出现的索引：</p>
          <p>如果未找到文本， indexOf() 和 lastIndexOf() 均返回 -1。</p>
          <p>两种方法都接受作为检索起始位置的第二个参数。</p>
        </li>
        <li>
          <p>检索字符串中的字符串: <i>search()</i> </p>
          <p>search() 方法搜索特定值的字符串，并返回匹配的位置：</p>
          <p> <i>search()和indexOf()两种方法的区别</i> </p>
          <p>a:search() 方法无法设置第二个开始位置参数。</p>
          <p>b:indexOf() 方法无法设置更强大的搜索值（正则表达式）。</p>
        </li>
        <li>
          <p>提取部分字符串：</p>
          <ul>
            <li> <i>slice(start, end)</i> </li>
            <li> <i>substring(start, end)</i> </li>
            <li> <i>substr(start, length)</i> </li>
          </ul>
          <p> <i>提取字符串三种方法都不会改变原字符串</i> </p>
        </li>
        <li>
          <p>替换字符串内容：<i>replace()</i> </p>
          <p>replace() 方法用另一个值替换在字符串中指定的值：</p>
          <p>replace() 方法不会改变调用它的字符串。它返回的是新字符串。</p>
          <p>默认地，replace() 只替换首个匹配：</p>
          <p>默认地，replace() 对大小写敏感。</p>
          <p>如需执行大小写不敏感的替换，请使用正则表达式 /i（大小写不敏感）：</p>
          <p>如需替换所有匹配，请使用正则表达式的 g 标志（用于全局搜索）：</p>
        </li>
        <li>
          <p>链接字符串：<i>concat()</i> </p>
        </li>
        <li>
          <p>删除字符串两端的空白符: <i>trim()</i> </p>
        </li>
        <li>
          <p>获取字符串中指定下标（位置）的字符串：<i>charAt()</i> </p>
        </li>
        <li>
          <p>把字符串转换为数组: <i>split()</i> </p>
        </li>
      </ol>
    </div>
    <div class="demo-wrp">
      <h2>三、Es6新增字符串方法</h2>
      <ol>
        <li>includes()：返回布尔值，表示是否找到了参数字符串。</li>
        <li>startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。</li>
        <li>endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。</li>
        <li>repeat():方法返回一个新字符串，表示将原字符串重复n次。</li>
        <li>
          <p>字符串补全：</p>
          <p>padStart():用于头部补全</p>
          <p>padEnd():用于尾部补全。</p>
          <p>接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串。</p>
          <p>如果原字符串的长度，等于或大于最大长度，则字符串补全不生效，返回原字符串。</p>
          <p>如果用来补全的字符串与原字符串，两者的长度之和超过了最大长度，则会截去超出位数的补全字符串。</p>
          <p>如果省略第二个参数，默认使用空格补全长度。</p>
        </li>
        <li>
          <p>字符串空格：</p>
          <p>trimStart()消除字符串头部的空格</p>
          <p>trimEnd()消除尾部的空格</p>
        </li>
      </ol>
    </div>
  </div>
</template>
<script>
import BackHome from '../components/BackHome';
export default {
  name: 'JsString',
  props: {},
  data() {
    return {
      aString: 'welcome to beijing funny!'
    };
  },
  computed: {},
  components: {
    BackHome
  },
  watch: {},
  methods: {
    consoleMethod() {
      // length
      // console.log(this.aString.length);
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
