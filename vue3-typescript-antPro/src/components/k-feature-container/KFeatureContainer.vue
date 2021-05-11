<template>
  <div class="k-feature-container">
    <header>
      <i class="iconfont icon-baobiaoguanli"></i>
      <span class="title-text">{{ title }}</span>
    </header>
    <div v-if="listArr.length > 0" class="feature-wrp">
      <div class="feature-row" v-for="(item, index) in transformArr" :key="index">
        <div class="felx-item" v-for="(pre, ix) in item" :key="ix">
          <KFeaturePre :title="pre.name" :iconfontName="pre.iconfontName"></KFeaturePre>
        </div>
      </div>
    </div>
    <div v-else class="no-data">暂无数据</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef, PropType, ref } from 'vue';
import KFeaturePre from './KFeaturePre.vue';
import { FeatureItem } from './type';
import useCrreateTwoDimension from './crreateTwoDimension';
interface Props {
  titleName?: string;
  fartureArr?: Array<FeatureItem>;
}
export default defineComponent({
  name: 'KFeatureContainer',
  props: {
    titleName: {
      type: String,
      required: false,
      default: '标题'
    },
    fartureArr: {
      type: Array as PropType<Array<FeatureItem>>,
      required: false,
      default: () => []
    }
  },
  components: {
    KFeaturePre
  },
  setup(props: Props) {
    const title = toRef(props, 'titleName');
    const listArr = toRef(props, 'fartureArr');
    const transformArr = ref(useCrreateTwoDimension(listArr.value as Array<FeatureItem>));
    return {
      title,
      listArr,
      transformArr
    };
  }
});
</script>

<style lang="scss" scoped>
$yellowColor: #ff6a00;
.k-feature-container {
  width: 100%;
  height: auto;
  border-top: 1px solid $yellowColor;
  padding-bottom: 32px;
  header {
    height: 42px;
    line-height: 42px;
    padding-left: 6px;
    .iconfont {
      color: $yellowColor;
      font-size: 16px;
    }
    .title-text {
      font-size: 14px;
      color: #333;
      margin-left: 8px;
    }
  }
  .feature-row {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 8px;
    .felx-item {
      flex: 0 0 12.5%;
      width: 0;
    }
  }
  .no-data {
    padding-top: 46px;
    font-size: 14px;
    color: #ccc;
    text-align: center;
  }
}
</style>
