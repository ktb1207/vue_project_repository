<style lang="less">
.box-shadow {
  height: auto;
  .flex-row {
    height: 340px;
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-items: stretch;
    padding: 24px;
    .flex-item {
      flex: 1 1 auto;
      border: 1px solid #409eff;
      padding: 24px;
      & + .flex-item {
        margin-left: 24px;
      }
    }
    .shadow-demo-one {
      width: 160px;
      height: 160px;
      background-color: aqua;
      box-shadow: 180px -24px 0px 0px #333333;
    }
    .shadow-demo-two {
      width: 160px;
      height: 160px;
      background-color: aqua;
      box-shadow: 180px -24px 0px -32px #333333;
    }
    .shadow-demo-three {
      width: 160px;
      height: 160px;
      background-color: aqua;
      box-shadow: 180px -24px 10px -32px #333333;
    }
    .shadow-demo-four {
      width: 160px;
      height: 160px;
      background-color: #ffffff;
      box-shadow: 0px 0px 4px 2px #e7e9f5;
    }
    .shadow-demo-five {
      width: 160px;
      height: 160px;
      background-color: #ffffff;
      box-shadow: 0px 4px 8px -4px #333333;
    }
    .shadow-demo-six {
      width: 160px;
      height: 160px;
      background-color: #ffffff;
      box-shadow: -4px 0px 8px -4px red, 0px -4px 8px -4px green,
        4px 0px 8px -4px blue, 0px 4px 8px -4px yellow;
    }
    .shadow-demo-seven {
      width: 160px;
      height: 160px;
      background-color: #ffffff;
      box-shadow: 0px 0px 0px 4px#ffffff, 0px 0px 0px 0px #ffffff,
        8px 0px 10px -4px blue, 0px 0px 0px 0px #ffffff;
    }
    .shadow-demo-eight {
      width: 160px;
      height: 160px;
      background-color: #ffffff;
      box-shadow: 0px 0px 0px 0px#ffffff,
        // 左
          0px 0px 0px 4px #ffffff,
        // 上
          0px 0px 0px 0px #ffffff,
        // 右
          0px 8px 10px -4px blue; // 下
    }
  }
}
</style>
<template>
  <div class="box-shadow">
    <back-home></back-home>
    <div class="header">
      <el-button type="primary">box-shadow：水平阴影位置 垂直阴影位置 模糊距离 阴影尺寸 阴影颜色 outset/inset</el-button> <br />
      <el-button type="primary">offset-x 设置水平偏移量，如果是负值则阴影位于元素左边,正值在元素右边</el-button> <br />
      <el-button type="primary">offset-y 设置垂直偏移量，如果是负值则阴影位于元素上面,正值在元素下边</el-button> <br />
      <el-button type="primary">blur-radius: 这是第三个 length 值。值越大，模糊面积越大，阴影就越大越淡。 不能为负值。默认为0,此时阴影边缘锐利</el-button><br />
      <el-button type="primary">spread-radius : 这是第四个 length 值。取正值时，阴影扩大；取负值时，阴影收缩。默认为0，此时阴影与元素同样大。</el-button><br />
    </div>
    <div class="flex-row">
      <div class="flex-item">
        <div class="shadow-demo-one"></div>
        <div class="remark">
          <p>说明：box-shadow:180px -24px 0px 0px #333333;</p>
          <p>阴影水平向右平移180px,垂直方向向上24px</p>
          <p>blur-radius取值为0，阴影边框不模糊，比较锐利</p>
          <p>spread-radius取值为0，阴影同容器大小一致</p>
          <p>box-shadow不受外层容器padding影响，不受本身margin阴影，不占据相邻元素位置空间但会覆盖紧挨的元素</p>
        </div>
      </div>
      <div class="flex-item">
        <div class="shadow-demo-two"></div>
        <div class="remark">
          <p>说明：box-shadow:180px -24px 0px -32px #333333;</p>
          <p>阴影水平向右平移180px,垂直方向向上24px</p>
          <p>blur-radius取值为0，阴影边框不模糊，比较锐利</p>
          <p>spread-radius取值为-32，阴影缩小</p>
        </div>
      </div>
      <div class="flex-item">
        <div class="shadow-demo-three"></div>
        <div class="remark">
          <p>说明：box-shadow:180px -24px 10px -32px #333333;</p>
          <p>阴影水平向右平移180px,垂直方向向上24px</p>
          <p>blur-radius取值为10px，阴影边框模糊10px</p>
          <p>spread-radius取值为-32，阴影缩小</p>
        </div>
      </div>
    </div>
    <div class="flex-row">
      <div class="flex-item">
        <div class="shadow-demo-four"></div>
        <div class="remark">
          <p>4边阴影效果实现：</p>
          <p>说明：box-shadow: 0px 0px 4px 2px #e7e9f5;</p>
          <p>阴影水平0px不动,垂直方向0px不动</p>
          <p>blur-radius取值为4px，阴影边框模糊4px</p>
          <p>spread-radius取值为2px，阴影放大容器的2px大小</p>
        </div>
      </div>
      <div class="flex-item">
        <div class="shadow-demo-five"></div>
        <div class="remark">
          <p>下边框阴影效果简单实现</p>
          <p>说明：box-shadow: 0px 4px 8px -4px #333333</p>
          <p>阴影水平0px不动,垂直方向4px向下移动</p>
          <p>blur-radius取值为8px，阴影边框模糊8px</p>
          <p>spread-radius取值为-4px，阴影缩小容器的4px大小</p>
        </div>
      </div>
      <div class="flex-item">
        <div class="shadow-demo-six"></div>
        <div class="remark">
          <p>4边不同颜色框阴影效果简单实现</p>
          <p>说明：box-shadow: -4px 0px 8px -4px red,</p>
          <p>0px -4px 8px -4px green,</p>
          <p>4px 0px 8px -4px blue,</p>
          <p>0px 4px 8px -4px yellow;</p>
        </div>
      </div>
    </div>
    <div class="flex-row">
      <div class="flex-item">
        <div class="shadow-demo-seven"></div>
        <div class="remark">
          <p>右边框阴影效果准确实现</p>
          <p>说明：box-shadow: 0px 0px 0px 4px #ffffff,</p>
          <p>0px 0px 0px 0px #ffffff,</p>
          <p>8px 0px 10px -4px blue,</p>
          <p>0px 0px 0px 0px #ffffff;</p>
        </div>
      </div>
      <div class="flex-item">
        <div class="shadow-demo-eight"></div>
        <div class="remark">
          <p>下边框阴影效果准确实现</p>
          <p>说明：box-shadow: 0px 0px 0px 0px#ffffff,</p>
          <p>0px 0px 0px 4px #ffffff,</p>
          <p>0px 0px 0px 0px #ffffff,</p>
          <p>0px 8px 10px -4px blue;</p>
        </div>
      </div>
      <div class="flex-item"></div>
    </div>
  </div>
</template>
<script>
import BackHome from '../components/BackHome';
export default {
  name: 'boxShadow',
  props: {},
  data() {
    return {};
  },
  computed: {},
  components: {
    BackHome
  },
  watch: {},
  methods: {},
  created() {},
  mounted() {},
  updated() {},
  beforeDestroy() {}
};
</script>
