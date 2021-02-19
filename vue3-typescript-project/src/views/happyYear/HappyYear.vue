<template>
  <div class="router-view happy-year">
    <div class="row-title">
      <transition name="title">
        <div v-show="showTitle" class="title-text">新年快乐</div>
      </transition>
    </div>
    <div class="column-wrp">
      <transition-group name="left-group" tag="div" class="left">
        <div class="column-text" v-for="(name, index) in reactiveLeftTextArr" :key="index">{{ name }}</div>
      </transition-group>

      <transition-group name="right-group" tag="div" class="right">
        <div class="column-text" v-for="(name, index) in reactiveRightTextArr" :key="index">{{ name }}</div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, reactive, nextTick, watch, ref } from 'vue';
import { delayAdd } from './delayAdd';
export default defineComponent({
  name: 'HappyYear',
  setup() {
    const leftTextArr: Array<string> = ['牛', '气', '冲', '天', '步', '步', '高'];
    const rightTextArr: Array<string> = ['人', '和', '家', '顺', '年', '年', '好'];
    const reactiveLeftTextArr = reactive<Array<string>>([]);
    const reactiveRightTextArr = reactive<Array<string>>([]);
    const showTitle = ref<boolean>(false);
    let leftStep = 0;
    let rightStep = 0;
    /**
     * @description：右侧添加文字
     */
    const showRightText = async () => {
      await delayAdd(rightStep, rightTextArr).then((res) => {
        reactiveRightTextArr.push(rightTextArr[rightStep]);
        rightStep += 1;
      });
      if (rightStep >= rightTextArr.length) {
        // 右侧文字显示完毕
        // 显示标题
        // 清空左右侧文字，重新添加显示
        nextTick(() => {
          console.log('执行完毕');
          // 显示标题
          showTitle.value = true;
          setTimeout(() => {
            reactiveLeftTextArr.splice(0, reactiveLeftTextArr.length);
            leftStep = 0;
            reactiveRightTextArr.splice(0, reactiveRightTextArr.length);
            rightStep = 0;
          }, 2000);
        });
      }
    };
    /**
     * @description：左侧添加文字
     */
    const showLeftText = async () => {
      if (leftStep > leftTextArr.length - 1) {
        // 左侧文字添加完毕，执行右侧文字添加
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
    watch(reactiveRightTextArr, (newVal: Array<string>) => {
      if (newVal.length === 0) {
        // 一轮循环显示结束，清空不执行添加操作
        // 隐藏标题
        showTitle.value = false;
        return;
      }
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
    return { reactiveLeftTextArr, reactiveRightTextArr, showTitle };
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
    padding: 0;
    flex: 0 0 86px;
    font-size: 48px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .column-wrp {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 42px;
    position: relative;
  }
  // 左侧动画
  .left-group-enter-from,
  .left-group-leave-to {
    opacity: 0;
    transform: translateY(1000px);
  }
  .left-group-enter-active,
  .left-group-leave-active {
    transition: all 1s ease;
  }
  // 右侧动画
  .right-group-enter-from,
  .right-group-leave-to {
    opacity: 0;
    transform: translateY(-1000px);
  }
  .right-group-enter-active,
  .right-group-leave-active {
    transition: all 1s ease;
  }
  // title动画
  .title-enter-from {
    opacity: 0;
    font-size: 12px;
    width: 0px;
  }
  .title-leave-to {
    opacity: 0;
    font-size: 12px;
    width: 0px;
  }
  .title-enter-active,
  .title-leave-active {
    transition: all 1s ease;
  }
}
</style>
