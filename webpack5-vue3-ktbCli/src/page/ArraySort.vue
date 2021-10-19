<template>
  <div>
    <h3>数组排序</h3>
    <p>
      测试数组：<span>{{ testArr }}</span>
    </p>
    <hr />
    <h5>基础排序</h5>
    <p>
      冒泡排序结果：<span>{{ bubblingSort(testArr) }}</span>
    </p>
    <p>
      选择排序：<span>{{ selectionSort(testArr) }}</span>
    </p>
    <p>插入排序适用于小量数据情况下</p>
    <p>
      插入排序1：<span>{{ insertSort(testArr) }}</span>
    </p>
    <p>
      插入排序2：<span>{{ insertSort2(testArr) }}</span>
    </p>
    <hr />
    <h5>进阶排序</h5>
    <p>快速排序：适合大量数据排序</p>
    <i>
      快速排序是对冒泡排序算法的一种改进，基本思想是通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据比另一部分的所有数据要小
    </i>
    <br />
    <i> 再按这种方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，使整个数据变成有序序列 </i>
    <br />
    <i>实现思路如下：</i>
    <ul>
      <li>从数列中挑出一个元素，称为"基准"（pivot）</li>
      <li>
        重新排序数列，所有比基准值小的元素摆放在基准前面，所有比基准值大的元素摆在基准后面（相同的数可以到任何一边）。在这个分区结束之后，该基准就处于数列的中间位置。这个称为分区（partition）操作
      </li>
      <li>递归地（recursively）把小于基准值元素的子数列和大于基准值元素的子数列排序</li>
    </ul>
    <p>
      快速排序结果：<span>{{ quickSort(testArr) }}</span>
    </p>
    <hr />
    <p>关于javascript中Array.sort()方法的解析：</p>
    <p>在数据量小于10的情况下，使用插入排序</p>
    <p>在大数据量情况下，使用快速排序</p>
    <p>总结为：使用插入排序和快速排序的混合排序</p>
  </div>
</template>

<script>
export default {
  setup() {
    const testArr = [5, 2, 3, 1, 4, 7, 6];
    /**
     * @description 冒泡排序
     * @param {arr}
     * @returns {arr}
     * */
    function bubblingSort(arr) {
      const _arr = [...arr];
      const len = _arr.length;
      for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          if (_arr[j] > _arr[j + 1]) {
            const temp = _arr[j + 1];
            _arr[j + 1] = _arr[j];
            _arr[j] = temp;
          }
        }
      }
      return _arr;
    }
    /**
     * @description 选择排序
     * @param {arr}
     * @returns {arr}
     * */
    function selectionSort(arr) {
      let maxindex, temp;
      const _arr = [...arr];
      const len = _arr.length;
      for (let i = 0; i < len - 1; i++) {
        maxindex = i; // 假定第一个值最大
        // 内层遍历，每一轮循环找出一个最大值
        for (let j = i + 1; j < len; j++) {
          if (_arr[j] < _arr[maxindex]) {
            maxindex = j;
          }
        }
        temp = _arr[i];
        _arr[i] = _arr[maxindex];
        _arr[maxindex] = temp;
      }
      return _arr;
    }

    /**
     * @description 插入排序
     * @param {arr}
     * @returns {arr}
     * */
    function insertSort(arr) {
      const _arr = [...arr];
      const len = _arr.length;
      let preIndex, current;
      // i从1开始，默认0是已排序元素
      for (let i = 1; i < len; i++) {
        preIndex = i - 1; // 已排序序列--末尾索引
        current = arr[i]; // 未排序序列--第一个值
        while (preIndex >= 0 && _arr[preIndex] > current) {
          _arr[preIndex + 1] = _arr[preIndex];
          preIndex--;
        }
        _arr[preIndex + 1] = current;
      }
      return _arr;
    }
    /**
     * @description 插入排序
     * @param {arr}
     * @returns {arr}
     * */
    function insertSort2(arr) {
      const _arr = [...arr];
      const new_arr = [];
      const len = _arr.length;
      let current;
      for (let i = 0; i < len; i++) {
        current = _arr[i];
        if (new_arr.length === 0) {
          new_arr.push(current);
        } else {
          let new_len = new_arr.length;
          while (new_len >= 0 && new_arr[new_len - 1] > current) {
            new_len--;
          }
          new_arr.splice(new_len, 0, current);
        }
      }
      return new_arr;
    }

    /**
     * @description 快速排序
     * @param {arr}
     * @returns {arr}
     * */
    function quickSort(arr) {
      const _arr = [...arr];
      const rec = (ars) => {
        if (ars.length <= 1) {
          return ars;
        } else {
          const left = [];
          const right = [];
          const mid = ars[0]; // 基准元素
          for (let i = 1; i < ars.length; i++) {
            // i = 1,开始
            ars[i] < mid ? left.push(ars[i]) : right.push(ars[i]);
          }
          return [...rec(left), mid, ...rec(right)];
        }
      };
      return rec(_arr);
    }
    return {
      testArr,
      bubblingSort,
      selectionSort,
      insertSort,
      insertSort2,
      quickSort
    };
  }
};
</script>
