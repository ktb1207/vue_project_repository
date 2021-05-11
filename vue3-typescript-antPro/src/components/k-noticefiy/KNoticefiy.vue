<template>
  <div class="k-noticeify-wrp">
    <header>
      <span class="title">{{ titleName }}</span>
      <span class="more">{{ moreNameCopy }}>></span>
    </header>
    <div class="ul-block" v-if="listArr.length > 0">
      <ul class="list-ul">
        <li v-for="item in listArr" :key="item.id">
          <div class="li-row">
            <div class="row-left">{{ item.title }}</div>
            <div class="row-right">{{ item.dateStr }}</div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="no-data-tip">暂无数据</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef, PropType } from 'vue';
import { InfoItem } from './type';
interface Props {
  title: string;
  moreName?: string;
  infoArr?: Array<InfoItem>;
}
export default defineComponent({
  name: 'KNoticefiy',
  props: {
    title: {
      type: String,
      required: true,
      default: '标题'
    },
    moreName: {
      type: String,
      required: false,
      default: '更多'
    },
    infoArr: {
      type: Array as PropType<Array<InfoItem>>,
      required: false,
      default: () => []
    }
  },
  setup(props: Props) {
    const titleName = toRef(props, 'title');
    const moreNameCopy = toRef(props, 'moreName');
    const listArr = toRef(props, 'infoArr');
    return {
      titleName,
      moreNameCopy,
      listArr
    };
  }
});
</script>

<style lang="scss" scoped>
.k-noticeify-wrp {
  width: 100%;
  header {
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #e60505;
    background: url('../../assets/images/notice_shape.png') no-repeat left bottom / 100px auto;
    color: #e60505;
    font-size: 14px;
    .title {
      display: inline-block;
      padding-left: 12px;
    }
    .more {
      float: right;
      padding-right: 12px;
      cursor: pointer;
    }
  }
  .ul-block {
    padding-left: 12px;
  }
  .list-ul {
    padding: 14px 12px 12px 8px;
    li {
      list-style: disc;
      font-size: 14px;
      color: #3f3f3f;
      margin-bottom: 12px;
      cursor: pointer;
      .li-row {
        display: flex;
        flex-wrap: nowrap;
        .row-left {
          flex: 1 1 auto;
          width: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .row-right {
          flex: 0 0 auto;
        }
      }
    }
  }
  .no-data-tip {
    margin-top: 46px;
    text-align: center;
    font-size: 14px;
    color: #ccc;
  }
}
</style>
