<template>
  <div class="router-view happy-year">
    <div class="row-title">
      <span>新年快乐</span>
    </div>
    <div class="column-wrp">
      <div class="left">
        <div class="column-text">牛</div>
        <div class="column-text">气</div>
        <div class="column-text">冲</div>
        <div class="column-text">天</div>
        <div class="column-text">步</div>
        <div class="column-text">步</div>
        <div class="column-text">高</div>
      </div>
      <div class="right">
        <div class="column-text">人</div>
        <div class="column-text">和</div>
        <div class="column-text">家</div>
        <div class="column-text">顺</div>
        <div class="column-text">年</div>
        <div class="column-text">年</div>
        <div class="column-text">好</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.happy-year {
  background-color: red;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  .row-title {
    padding: 16px 0;
    flex: 0 0 auto;
  }
  .column-wrp {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
