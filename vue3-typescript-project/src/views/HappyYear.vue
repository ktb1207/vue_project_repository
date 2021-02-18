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
export default defineComponent({
  name: 'HappyYear',
  setup() {
    const leftTextArr = ['牛', '气', '冲', '天', '步', '步', '高'];
    const rightTextArr = ['人', '和', '家', '顺', '年', '年', '好'];
    const reactiveLeftTextArr = reactive<Array<string>>([]);
    const reactiveRightTextArr = reactive<Array<string>>([]);
    let leftStep = 0;
    let rightStep = 0;
    const showRightText = () => {
      if (rightStep > rightTextArr.length - 1) return;
      const clearRightTimeOut = setTimeout(() => {
        reactiveRightTextArr.push(rightTextArr[rightStep]);
        rightStep += 1;
        if (rightStep >= leftTextArr.length - 1) clearTimeout(clearRightTimeOut);
      }, 600);
    };

    const showLeftText = () => {
      if (leftStep > leftTextArr.length - 1) {
        showRightText();
        return;
      }
      const clearLeftTimeOut = setTimeout(() => {
        reactiveLeftTextArr.push(leftTextArr[leftStep]);
        leftStep += 1;
        if (leftStep >= leftTextArr.length - 1) clearTimeout(clearLeftTimeOut);
      }, 600);
    };

    watch(reactiveLeftTextArr, () => {
      nextTick(() => {
        showLeftText();
      });
    });
    watch(reactiveRightTextArr, () => {
      nextTick(() => {
        showRightText();
      });
    });
    onMounted(() => {
      showLeftText();
    });
    onUpdated(() => {
      console.log('更新了');
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
