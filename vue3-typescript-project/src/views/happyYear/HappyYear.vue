<template>
  <div class="router-view happy-year">
    <div class="row-title">
      <span>新年快乐</span>
    </div>
    <div class="column-wrp">
      <div class="left">
        <div class="column-text" v-for="(name, index) in reactiveLeftTextArr" :key="index">{{ name }}</div>
      </div>
      <div class="right">
        <div class="column-text" v-for="(name, index) in reactiveRightTextArr" :key="index">{{ name }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, reactive, nextTick, watch } from 'vue';
import { delayAdd } from './delayAdd';
export default defineComponent({
  name: 'HappyYear',
  setup() {
    const leftTextArr: Array<string> = ['牛', '气', '冲', '天', '步', '步', '高'];
    const rightTextArr: Array<string> = ['人', '和', '家', '顺', '年', '年', '好'];
    const reactiveLeftTextArr = reactive<Array<string>>([]);
    const reactiveRightTextArr = reactive<Array<string>>([]);
    let leftStep = 0;
    let rightStep = 0;
    /**
     * @description：右侧添加文字
     */
    const showRightText = async () => {
      if (rightStep > rightTextArr.length - 1) {
        // 右侧文字显示完毕
        // 清空左右侧文字，重新添加显示
        console.log('执行完毕');
        nextTick(() => {
          setTimeout(() => {
            reactiveLeftTextArr.splice(0, reactiveLeftTextArr.length);
            leftStep = 0;
          }, 2000);
        });
      }
      await delayAdd(rightStep, rightTextArr).then((res) => {
        reactiveRightTextArr.push(rightTextArr[rightStep]);
        rightStep += 1;
      });
    };
    /**
     * @description：左侧添加文字
     */
    const showLeftText = async () => {
      if (leftStep > leftTextArr.length - 1) {
        // 左侧文字添加完毕，执行右侧文字添加
        reactiveRightTextArr.splice(0, reactiveRightTextArr.length);
        rightStep = 0;
        showRightText();
        return;
      }
      await delayAdd(leftStep, leftTextArr).then((res) => {
        reactiveLeftTextArr.push(res);
        leftStep += 1;
      });
    };
    /**
     * @description：左侧文字变化更新
     */
    watch(reactiveLeftTextArr, () => {
      nextTick(() => {
        showLeftText();
      });
    });
    /**
     * @description:右侧文字变化更新
     */
    watch(reactiveRightTextArr, () => {
      nextTick(() => {
        showRightText();
      });
    });
    /**
     * @description: 初始化执行左边
     */
    onMounted(() => {
      showLeftText();
    });
    return { reactiveLeftTextArr, reactiveRightTextArr };
  }
});
</script>

<style lang="scss">
.happy-year {
  background-color: red;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  .row-title {
    padding: 16px 0;
    flex: 0 0 auto;
    text-align: center;
    font-size: 48px;
  }
  .column-wrp {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 42px;
    position: relative;
  }
}
</style>
