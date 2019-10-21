<style lang="less">
@theme-secondary-color: #004cff;
.max-height-page {
  display: flex;
  flex-direction: column;
  .header-wrp {
    padding-top: 20px;
    background-color: @theme-secondary-color;
    flex: 0 0 auto;
  }
  .content-wrp {
    flex: 1 1 auto;
    position: relative;
    overflow: auto;
    padding: 15px;
    .weui-cell {
      padding: 8px 0;
      .vux-label {
        color: #666666;
        font-size: 15px;
      }
      .weui-cell__ft {
        color: #333333;
        font-size: 15px;
      }
    }
    .material-table-wrp {
      margin-top: 12px;
      box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.12),
        0px -2px 5px 1px rgba(0, 0, 0, 0.12);
    }
  }
}
</style>
<template>
  <div class="max-height-page">
    <div class="header-wrp">
      <x-header :left-options="{showBack:false}">提料单</x-header>
    </div>
    <div class="content-wrp">
      <group label-width="84px">
        <cell title="施工单位:" value-align="left">{{contentObj.organizationName}}</cell>
        <cell title="工程名称:" value-align="left">{{contentObj.projectName}}</cell>
        <cell title="项目地址:" value-align="left">{{contentObj.projectAddr}}</cell>
        <cell title="项目部位:" value-align="left">{{contentObj.constructionSectionIdNames}}</cell>
        <cell title="构件类型:" value-align="left">{{contentObj.elementNames}}</cell>
      </group>
      <div class="material-table-wrp">
        <x-table :cell-bordered="false" style="background-color:#fff;">
          <thead>
            <tr>
              <th>材料</th>
              <th>工程量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in contentObj.materials" :key="index">
              <td>{{item.materialName}}</td>
              <td>{{item.quantities}}</td>
            </tr>
          </tbody>
        </x-table>
      </div>
      <group label-width="84px">
        <cell title="使用时间:" value-align="left">{{contentObj.useTime}}</cell>
        <cell title="联系电话:" value-align="left">{{contentObj.contactWay}}</cell>
        <cell title="材料说明:" value-align="left" align-items="flex-start">{{contentObj.descr}}</cell>
      </group>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions } from 'vuex';
import {
  XHeader,
  Cell,
  CellBox,
  Group,
  XInput,
  Datetime,
  XTextarea,
  XTable
} from 'vux';
export default {
  name: 'home',
  components: {
    XHeader,
    Cell,
    CellBox,
    Group,
    XInput,
    Datetime,
    XTextarea,
    XTable
  },

  data() {
    return {
      projectId: '',
      detailsId: '',
      contentObj: {}
    };
  },
  methods: {
    ...mapActions(['showLoading', 'hideLoading', 'showError']),
    async fetchPageData() {
      this.showLoading();
      this.contentObj = {};
      this.$get(this.$api.drawShareData(this.projectId, this.detailsId))
        .then(res => {
          if (res.data.code === 0) {
            this.contentObj = res.data.data;
          }
        })
        .catch(error => {
          this.showError(error.response.data.message);
          this.hideLoading();
        });
    }
  },
  created() {},
  mounted() {
    this.projectId = this.$route.params.projectId;
    this.detailsId = this.$route.params.shareId;
    this.fetchPageData();
  }
};
</script>
