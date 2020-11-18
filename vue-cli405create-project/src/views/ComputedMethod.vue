<template>
  <div class="computed-metho-demo">
    <back-home></back-home>
    <div class="demo-wrp">
      <h2>关于javascript的常用计算方法总结：</h2>
    </div>
    <div class="demo-wrp">
      <h2>一、写一个函数，统计字符串里出现出现频率最多的字符</h2>
      <p>字符串:'{{ strDemoOne }}'</p>
      <p>结果：{{ resultOne }}出现最多</p>
    </div>
    <div class="demo-wrp">
      <h2>二、实现数组去重</h2>
      <p>数组：{{demoTwoArr}}</p>
      <p>方法一、使用es6 set数据结构实现，结果：{{demoTwoResultOne}}</p>
      <p>方法二、通过使用创建对象去重，结果：{{demoTwoResultTwo}}</p>
    </div>
    <div class="demo-wrp">
      <h2>三、排序两个数组</h2>
      <p>数组1：{{demoThreeArrOne}},数组2：{{demoThreeArrTwo}}</p>
      <p>方法一、根据数组sort排序，结果：{{demoThreeResultOne}}</p>
      <p>方法二、结果：{{demoThreeResultTwo}}</p>
    </div>
    <div>
      <button @click="buttonTest(sleepTime)">button click</button>
    </div>
  </div>
</template>

<script>
import BackHome from '../components/BackHome';
import Sleep from '../utils/sleep.js';
export default {
  name: 'computedMethod',
  props: {},
  components: {
    BackHome
  },
  data() {
    return {
      strDemoOne: 'abcdffgggdsfffffddddsssd',
      resultOne: '',
      resultOneNum: 0,
      demoTwoArr: [1, 2, 5, 8, 9, 7, 4, 1, 5, 2, 3, 0],
      demoTwoResultOne: [],
      demoTwoResultTwo: [],
      demoThreeArrOne: [4, 1, 9, 6, 8, 3],
      demoThreeArrTwo: [2, 7, 1, 3, 2],
      demoThreeResultOne: [],
      demoThreeResultTwo: [],
      maopaotestArr: [6, 1, 2, 3, 9, 8, 7, 1],
      charuTestArr: [6, 1, 2, 3, 9, 8, 7, 1],
      sleepTime:5000
    };
  },
  computed: {},
  watch: {},
  methods: {
    initMethods() {
      // 统计字符串出现最多
      this.resultOne = this.computedStrMaxPre(this.strDemoOne);
      // 数组去重
      this.repeatArrOneMethod();
      this.repeatArrTwoMethod();
      this.demoThreeResultOne = this.listByBigSmall(
        this.demoThreeArrOne,
        this.demoThreeArrTwo
      );
      this.demoThreeResultTwo = this.listByBigSmallMethods(
        this.demoThreeArrOne,
        this.demoThreeArrTwo
      );
      // 冒泡排序
      // this.maopaoSort(this.maopaotestArr);
      // 插入排序
      // this.insertSort(this.charuTestArr);
    },
    /**
     * 计算一个字符串中出现字符最多的字符
     */
    computedStrMaxPre(str) {
      if (str.length < 2) {
        return str;
      }
      // 创建对象记录字符串
      let createObj = {};
      for (let i = 0, j = str.length; i < j; i++) {
        let tag = str[i];
        if (createObj[tag]) {
          createObj[tag] = createObj[tag] + 1;
        } else {
          createObj[tag] = 1;
        }
      }
      let maxNum = 0; // 最大数
      let strArr = []; // 保存出现最大字符串
      // 递归对象
      for (const k in createObj) {
        if (createObj[k] > maxNum) {
          maxNum = createObj[k];
          strArr = [];
          strArr.push(k);
        } else if (createObj[k] === maxNum) {
          strArr.push(k);
        } else {
        }
      }
      return strArr.join(',');
    },
    /**
     *
     * 数组去重
     */
    // 方法一：使用es6 set数据结构
    repeatArrOneMethod() {
      this.demoTwoResultOne = Array.from(new Set(this.demoTwoArr));
    },
    // 方法二:通过使用创建对象去重
    repeatArrTwoMethod() {
      let createObj = {};
      this.demoTwoArr.forEach((v, i) => {
        if (createObj[v] === undefined) {
          createObj[v] = 1;
        }
      });
      this.demoTwoResultTwo = Object.keys(createObj);
    },
    /**
     *
     * 排序两个数组
     * */
    // 方法1 使用数组sort排序
    listByBigSmall(arr1, arr2) {
      if (!arr1 || !arr2) {
        return;
      }
      let cloneArr1 = arr1.sort(function(a, b) {
        return a - b;
      });
      let cloneArr2 = arr2.sort(function(a, b) {
        return a - b;
      });
      let resultArr = cloneArr1.concat(cloneArr2);
      resultArr.sort(function(a, b) {
        return a - b;
      });
      return resultArr;
    },
    /**
     * 方法2
     * 利用两个数组已经排好序这个条件，设置两个指针，分别指向两个数组
     * 当其中一个小于另外一个就将小的数push到新数组中，后移指针
     * 相等的话则全push到新数组中，两个指针全后移
     * 直到一个指针指到数组结尾，将另一个数组直接加入到新数组中即可
     * */

    listByBigSmallMethods(arr1, arr2) {
      if (!arr1 || !arr2) {
        return;
      }
      let cloneArr1 = arr1.sort(function(a, b) {
        return a - b;
      });
      let cloneArr2 = arr2.sort(function(a, b) {
        return a - b;
      });
      let [i, j] = [0, 0];
      let newArr = [];
      while (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
          newArr.push(arr1[i]);
          i++;
        } else if (arr1[i] > arr2[j]) {
          newArr.push(arr2[j]);
          j++;
        } else if (arr1[i] === arr2[j]) {
          newArr.push(arr1[i]);
          newArr.push(arr2[j]);
          i++, j++;
        }
      }
      // 将指针未移到末尾的部分取出,拼到新数组后面
      if (i < arr1.length) {
        return newArr.concat(arr1.splice(i));
      } else if (j < arr2.length) {
        return newArr.concat(arr2.splice(j));
      } else {
        return newArr;
      }
    },
    // 冒泡排序
    maopaoSort(arr) {
      console.log('原数组：' + arr);
      for (var i = 0; i < arr.length - 1; i++) {
        //确定轮数
        for (var j = 0; j < arr.length - i - 1; j++) {
          //确定每次比较的次数
          if (arr[j] > arr[j + 1]) {
            var tem = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = tem;
          }
        }
        console.log('第' + i + '次排序' + arr);
      }
      console.log('最终结果：' + arr);
    },
    // 插入排序
    insertSort(arr) {
      //获取数组的长度
      var len = arr.length;
      if (len <= 1) {
        return arr; //小于等于1不用排序
      }
      console.log('原始数组：' + arr);
      //i=1开始，留着0作为有序部分，也就是说，外层循环获取数组后面的元素，也就是上面所讲的无序部分
      for (var i = 1; i < len; i++) {
        //j=i-1，就是获取有序部分最后的一个元素作为对照，也就是有序部分
        for (var j = i - 1; j >= 0; j--) {
          //注意，j--,就是从有序部分的后面元素开始和无序部分的元素作比较
          if (arr[j] > arr[j + 1]) {
            //第一个j+1也就是外层循环i，
            //互换元素，对前面数组进行排序
            var temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        }
      }
      console.log('结果：' + arr);
      return arr;
    },
    buttonTest (delay) {
      const sleep = new Sleep()
      sleep.promise(delay).then(res => {
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
      setTimeout(() => {
        sleep.abort()
      },3000)
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.initMethods();
    });
  }
};
</script>

<style lang="less">
.computed-metho-demo {
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
