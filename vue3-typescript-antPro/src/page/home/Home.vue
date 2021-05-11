<template>
  <div class="root-router-page home-page">
    <div class="top-feature-wrp">
      <!-- header -->
      <div class="header-logo-wrp">
        <div class="left-logo">
          <img src="../../assets/images/index_top_text_icon.png" alt="left1" />
          <img src="../../assets/images/index_top_text.png" alt="left2" />
        </div>
        <!-- search -->
        <div class="center-search">
          <KIndexSearch></KIndexSearch>
        </div>
        <!-- setting -->
        <div class="right-setting">
          <KDropDown title="个人设置" iconName="icon-system-copy" @rootNodeClick="settingClick"></KDropDown>
        </div>
        <div class="right-setting">
          <KDropDown title="个人中心" iconName="icon-user"></KDropDown>
        </div>
      </div>
      <!-- 形状 -->
      <div class="shape-wrp">
        <div class="left">
          <div class="top"></div>
          <div class="bottom"></div>
        </div>
        <div class="center">
          <div class="center-shape">
            <KClassifyMenus
              :menus-arr="classifyArr"
              :active-prop="activeClassifyProp"
              styleType="index"
              @menuClick="switchClassify"
            ></KClassifyMenus>
          </div>
        </div>
        <div class="right">
          <div class="top"></div>
          <div class="bottom"></div>
        </div>
        <div class="right-image"></div>
      </div>
      <!-- 通知 -->
      <div class="white-feature-wrp">
        <div class="noticefiy-wrp">
          <div class="notice-item">
            <KNoticefiy title="通知公告" :info-arr="noticeData"></KNoticefiy>
          </div>
          <div class="notice-item">
            <KNoticefiy title="数据更新"></KNoticefiy>
          </div>
          <div class="notice-item">
            <KNoticefiy title="待办事项"></KNoticefiy>
          </div>
        </div>
        <!-- 模块分类 -->
        <div class="module-classify-wrp">
          <!-- 综合查询 -->
          <KFeatureContainer titleName="综合查询" :farture-arr="allFindArr"></KFeatureContainer>
          <KFeatureContainer titleName="采购管理"></KFeatureContainer>
          <KFeatureContainer titleName="招标管理"></KFeatureContainer>
        </div>
      </div>
    </div>
    <!-- link -->
    <div class="link-wrp">
      <div class="link-item link-title">友情链接</div>
      <div class="link-item">
        <a href="http://baidu.com" target="_blank">
          <img src="../../assets/images/index_link1.jpg" alt="link1" />
        </a>
      </div>
      <div class="link-item">
        <a href="http://baidu.com" target="_blank">
          <img src="../../assets/images/index_link2.png" alt="link2" />
        </a>
      </div>
      <div class="link-item">
        <a href="http://baidu.com" target="_blank">
          <img src="../../assets/images/index_link3.jpg" alt="link3" />
        </a>
      </div>
    </div>
    <!-- bottom -->
    <div class="home-bottom-wrp">
      <div class="row">
        <div class="item">
          <span>本站访问总量：</span>
          <span>122721</span>
        </div>
        <div class="item">
          <span>当日访问量：</span>
          <span>12</span>
        </div>
        <div class="item">
          <span>当前在线人数：</span>
          <span>9人</span>
        </div>
        <div class="item">
          <img class="iphone" src="../../assets/images/white_iphone.png" />
          <span>服务电话：</span>
          <span>010-63592075</span>
        </div>
        <div class="item">
          <img class="email" src="../../assets/images/white_email.png" alt="emial" />
          <span>服务邮箱：</span>
          <span>lilili@cnpc.com.cn</span>
        </div>
      </div>
      <div class="row margin-top">
        <div class="item">Copyright 版权所有：中国石油天然气集团有限公司 2019</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import KIndexSearch from '@/components/KIndexSearch.vue';
import KDropDown from '@/components/k-dropdown/KDropdown.vue';
import KClassifyMenus, { MenuItemType } from '@/components/KClassifyMenus.vue';
import KNoticefiy from '@/components/k-noticefiy/KNoticefiy.vue';
import { InfoItem } from '@/components/k-noticefiy/type';
import { KFeatureContainer, FeatureItem } from '@/components/k-feature-container/index';
export default defineComponent({
  name: 'Home',
  components: {
    KIndexSearch,
    KDropDown,
    KClassifyMenus,
    KNoticefiy,
    KFeatureContainer
  },
  setup() {
    const router = useRouter();
    /**
     * 系统分类
     */
    const activeClassifyProp = ref<string>('home');
    const classifyArr = reactive<Array<MenuItemType>>([
      {
        routeName: 'Home',
        prop: 'home',
        label: '首页'
      },
      {
        routeName: 'PlatformClassify',
        prop: 'autoWaring',
        label: '自动预警'
      },
      {
        routeName: 'PlatformClassify',
        prop: 'riskTip',
        label: '风险提示'
      }
    ]);
    const switchClassify = (routeNameStr: string, paramsStr: string | undefined): void => {
      if (paramsStr) {
        router.push({ name: routeNameStr, params: { classifyType: paramsStr } });
      } else {
        router.push({ name: routeNameStr });
      }
    };
    // 通知
    const noticeData = ref<Array<InfoItem>>([
      {
        title: '系统新增功能 "项目信息查询安康蛤科杜鹃花"',
        dateStr: '2019-12-11',
        id: '111'
      },
      {
        title: '系统新增功能 "往来帐查询"',
        dateStr: '2019-12-11',
        id: '112'
      },
      {
        title: '系统新增功能 "投标人异常"',
        dateStr: '2019-12-11',
        id: '113'
      },
      {
        title: '系统新增功能 "其它类查询"',
        dateStr: '2019-12-11',
        id: '114'
      }
    ]);

    // 综合查询
    const allFindArr = ref<Array<FeatureItem>>([
      {
        id: '11',
        name: '功能1',
        iconfontName: 'icon-riqi',
        isShow: true
      },
      {
        id: '12',
        name: '功能2',
        iconfontName: 'icon-riqi',
        isShow: true
      },
      {
        id: '13',
        name: '功能3',
        iconfontName: 'icon-riqi',
        isShow: true
      },
      {
        id: '14',
        name: '功能4',
        iconfontName: 'icon-riqi',
        isShow: true
      },
      {
        id: '15',
        name: '功能5',
        iconfontName: 'icon-riqi',
        isShow: true
      },
      {
        id: '16',
        name: '功能6',
        iconfontName: 'icon-riqi',
        isShow: true
      },
      {
        id: '17',
        name: '功能7',
        iconfontName: 'icon-riqi',
        isShow: true
      },
      {
        id: '18',
        name: '功能8',
        iconfontName: 'icon-riqi',
        isShow: true
      },
      {
        id: '19',
        name: '功能9',
        iconfontName: 'icon-riqi',
        isShow: true
      },
      {
        id: '20',
        name: '功能10',
        iconfontName: 'icon-riqi',
        isShow: true
      }
    ]);

    // 个人设置
    const settingClick = (): void => {
      router.push({ name: 'FeatureSetting' });
    };

    return {
      classifyArr,
      activeClassifyProp,
      switchClassify,
      noticeData,
      allFindArr,
      settingClick
    };
  }
});
</script>

<style lang="scss">
$wrpShapeHeight: 60px;
$innerShapeHeight: 38px;
$shapeRowHeight: 24px;
@mixin jianbian1 {
  background-image: linear-gradient(#f8f8f8, #ffffff);
}
.home-page {
  overflow: auto;
  .top-feature-wrp {
    overflow: hidden;
    height: auto;
    background: #fff url('../../assets/images/index_bg.jpg') no-repeat top left / 100% auto;
    padding: 0 60px;
    .header-logo-wrp {
      margin-top: 6px;
      height: 60px;
      position: relative;
      overflow: hidden;
      .left-logo {
        float: left;
        & > img:first-child {
          width: 58px;
          height: auto;
        }
        & > img:last-child {
          width: 258px;
          height: auto;
          margin-left: 6px;
        }
      }
      .center-search {
        position: absolute;
        left: 50%;
        top: 50%;
        width: auto;
        height: auto;
        transform: translate(-50%, -50%);
      }
      .right-setting {
        float: right;
        height: 100%;
        line-height: 60px;
      }
      & > .right-setting:last-child {
        margin-right: 38px;
      }
    }
    .shape-wrp {
      margin-top: 18px;
      height: $wrpShapeHeight;
      background-color: #d50503;
      display: flex;
      position: relative;
      .left {
        flex: 0 0 40px;
        height: 100%;
        display: flex;
        flex-direction: column;
        @include jianbian1;
        .top {
          flex: 1 1 auto;
          background-color: #d50503;
          border-bottom-right-radius: 10px;
        }
        .bottom {
          flex: 0 0 $shapeRowHeight;
          @include jianbian1;
        }
      }
      .center {
        flex: 1 1 auto;
        background-image: linear-gradient(#dbdbdb, #ffffff);
        height: 100%;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        padding: 0 14px;
        display: flex;
        align-items: center;
        .center-shape {
          flex: 1;
          height: $innerShapeHeight;
          background-image: linear-gradient(#f7f7f7, #ffffff);
          border-radius: 6px;
          box-shadow: 1px 0px 4px 1px #e4e7ed, 0px 1px 4px 1px #e4e7ed, -1px 0px 4px 1px #e4e7ed,
            0px -1px 4px 1px #d4d4d6;
          overflow-x: auto;
          display: flex;
          align-items: center;
        }
      }
      .right {
        flex: 0 0 40px;
        height: 100%;
        display: flex;
        flex-direction: column;
        @include jianbian1;
        .top {
          flex: 1 1 auto;
          background-color: #d50503;
          border-bottom-left-radius: 10px;
        }
        .bottom {
          flex: 0 0 $shapeRowHeight;
          @include jianbian1;
        }
      }
      .right-image {
        // background: url();
      }
    }
    .white-feature-wrp {
      height: auto;
      overflow: hidden;
      background-color: #fff;
      .noticefiy-wrp {
        display: flex;
        .notice-item {
          flex: 1;
          margin-left: 26px;
          height: auto;
        }
        & > .notice-item:last-child {
          margin-right: 26px;
        }
      }
      .module-classify-wrp {
        padding: 0 26px;
      }
    }
  }
  .link-wrp {
    padding: 28px 60px;
    background-color: #fff;
    line-height: 48px;
    display: flex;
    flex-wrap: wrap;
    .link-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      a {
        vertical-align: middle;
      }
    }
    .link-title {
      font-size: 14px;
      color: #000;
      font-weight: bold;
    }
  }
  .home-bottom-wrp {
    padding: 41px 60px;
    background-color: #da2626;
    .row {
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      color: #fff;
      .item {
        flex: 1;
        text-align: center;
      }
      .iphone {
        width: 26px;
        margin-right: 24px;
      }
      .email {
        width: 26px;
        margin-right: 24px;
      }
    }
    .margin-top {
      margin-top: 41px;
    }
  }
}
</style>
