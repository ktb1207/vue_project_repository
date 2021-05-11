<template>
  <div class="k-index-search">
    <input type="text" />
    <button>搜索</button>
  </div>
</template>

<style lang="scss" scoped>
$yelloColor: #ff6a00;
.k-index-search {
  height: auto;
  input {
    height: 26px;
    line-height: 26px;
    width: 196px;
    border: 2px solid $yelloColor;
    margin: 0;
    outline: none;
    background: #fff url('../assets/images/search-input_bg.png') no-repeat 4px center / 10px auto;
    padding: 0 16px;
    &:focus {
      // background: #fff;
    }
  }
  button {
    height: 26px;
    padding: 0 12px;
    background-color: $yelloColor;
    color: #fff;
    margin: 0;
    outline: none;
    border: 2px solid $yelloColor;
    font-size: 14px;
    &:focus {
      border-color: $yelloColor;
    }
    &:active {
      border-color: #f5ae6c;
    }
  }
}
</style>
