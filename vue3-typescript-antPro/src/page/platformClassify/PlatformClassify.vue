<template>
  <div class="root-router-page platform-page">
    <!-- 顶部 -->
    <header class="header-wrp">
      <img class="left-logo" src="../../assets/images/top_text_logo.png" alt="top_text_logo" />
      <div class="center-search">
        <KInput></KInput>
      </div>
      <div class="right-user">
        <KDropDown title="个人中心" iconName="icon-user"></KDropDown>
      </div>
    </header>
    <!-- 系统分类 -->
    <div class="menus-row">
      <div class="expand-btn" @click="changeLeftExpand">
        <i class="iconfont" :class="[leftMenuExpandStatus ? 'icon-zhankai' : 'icon-zhedie']"></i>
      </div>
      <div class="classify-wrp">
        <KClassifyMenus
          :menus-arr="classifyArr"
          :active-prop="activeClassifyProp"
          @menuClick="switchClassify"
        ></KClassifyMenus>
      </div>
    </div>
    <!-- 窗口内容 -->
    <div class="content-wrp">
      <div class="content-left">
        <KNavMenu
          :nav-menus="leftMenuData"
          :active-route-name="activeNavRouteName"
          :collapse-status="leftMenuExpandStatus"
          @itemClick="leftNavClick"
        ></KNavMenu>
      </div>
      <div class="content-right">
        <div class="child-route-tag">
          <KRouteRecord
            :list-arr="childRouteRecordData"
            :active-record="activeRecordRouteName"
            @delClick="deleteRecordData"
            @itemClick="selectRecordRoute"
          ></KRouteRecord>
        </div>
        <div class="child-router-view">
          <router-view v-slot="{ Component }">
            <keep-alive v-if="$route.meta.keepAlive">
              <component :is="Component" />
            </keep-alive>
            <component v-else :is="Component" />
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch, computed, onMounted, nextTick } from 'vue';
import { RouteMeta, useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { mainStorekey } from '@/store/index';
import KInput from '@/components/KInput.vue';
import KClassifyMenus, { MenuItemType } from '@/components/KClassifyMenus.vue';
import KNavMenu from '@/components/k-nav-menu/KNavMenu.vue';
import { NavMenuType } from '@/components/k-nav-menu/type';
import KRouteRecord from '@/components/KRouteRecord.vue';
import { RouteRecordItemType } from '@/store/index';
import { routerMap } from '@/router/routerMap';
import KDropDown from '@/components/k-dropdown/KDropdown.vue';
export default defineComponent({
  components: {
    KInput,
    KClassifyMenus,
    KNavMenu,
    KRouteRecord,
    KDropDown
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore(mainStorekey);
    console.log(route.params.classifyType);
    /**
     * 展开折叠控制
     */
    const leftMenuExpandStatus = ref<boolean>(false);
    const changeLeftExpand = (): void => {
      leftMenuExpandStatus.value = !leftMenuExpandStatus.value;
    };
    /**
     * 系统分类
     */
    const activeClassifyProp = ref<string>(route.params.classifyType as string);
    const classifyArr = reactive<Array<MenuItemType>>([
      {
        routeName: 'Home',
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
    /**
     * 左侧菜单
     */
    // 路由记录活动项
    const activeRecordRouteName = ref<string>('');
    const activeNavRouteName = ref<string>('');
    const leftMenuData = reactive<Array<NavMenuType>>([
      {
        index: 'goodsPurchase',
        navLable: '物资采购',
        iconName: 'icon-caigouguanli',
        children: [
          {
            index: 'goodsPurchase/PurchaseManager',
            navLable: '采购管理',
            routeName: 'PurchaseManager'
          }
        ]
      },
      {
        index: 'oilsSell',
        navLable: '油品销售',
        iconName: 'icon-youqitong_huaban1',
        children: [
          {
            index: 'oilsSell/OilsWholesale',
            navLable: '油品批发',
            routeName: 'OilsWholesale'
          }
        ]
      },
      {
        index: 'systemManage',
        navLable: '系统管理',
        iconName: 'icon-shezhi',
        children: [
          {
            index: 'systemManage/OrganManage',
            navLable: '组织机构管理',
            routeName: 'OrganManage'
          },
          {
            index: 'systemManage/UserManage',
            navLable: '用户管理',
            routeName: 'UserManage'
          },
          {
            index: 'systemManage/RoleManage',
            navLable: '角色管理',
            routeName: 'RoleManage'
          },
          {
            index: 'systemManage/MenuManage',
            navLable: '菜单管理',
            routeName: 'MenuManage'
          },
          {
            index: 'systemManage/PositionManage',
            navLable: '岗位管理',
            routeName: 'PositionManage'
          },
          {
            index: 'systemManage/DictionaryManage',
            navLable: '字典管理',
            routeName: 'DictionaryManage'
          },
          {
            index: 'systemManage/Notifications',
            navLable: '通知公告',
            routeName: 'Notifications'
          }
        ]
      },
      {
        index: 'logManage',
        navLable: '日志管理',
        iconName: 'icon-baobiaoguanli',
        children: [
          {
            index: 'logManage/OperationLogs',
            navLable: '操作日志',
            routeName: 'OperationLogs'
          },
          {
            index: 'logManage/LoggingLogs',
            navLable: '登录日志',
            routeName: 'LoggingLogs'
          }
        ]
      }
    ]);
    // 左侧菜单点击
    const leftNavClick = (routeName: string): void => {
      router.push({ name: routeName });
      activeNavRouteName.value = routeName;
      activeRecordRouteName.value = routeName;
      // 检查路由记录是否已存在
      const nowRecordData = computed(() => store.state.routeRecordData);
      let isExistStatus = false;
      nowRecordData.value.forEach((item) => {
        if (item.routeName === routeName) {
          isExistStatus = true;
        }
      });
      // 不存在-添加
      if (!isExistStatus) {
        let navName = '';
        routerMap.forEach((item) => {
          if (item.name === 'PlatformClassify') {
            item.children?.forEach((val) => {
              if (val.name === routeName) {
                navName = (val.meta as RouteMeta).title as string;
              }
            });
          }
        });
        const createRecordItem = {
          labelName: navName,
          routeName
        };
        store.dispatch('addRouteRecord', createRecordItem);
      }
    };
    /**
     * 路由缓存
     */
    const childRouteRecordData = computed(() => store.state.routeRecordData);
    const deleteRecordData = (item: RouteRecordItemType): void => {
      store.dispatch('reduceRouteRecord', item);
      // 删除项是否处于被激活
      // 激活-删除后，路由切换至路由记录最后一项
      // 未激活-直接删掉
      if (activeRecordRouteName.value === item.routeName) {
        nextTick(() => {
          const lastRecordItem = childRouteRecordData.value[childRouteRecordData.value.length - 1];
          activeRecordRouteName.value = lastRecordItem.routeName;
          activeNavRouteName.value = lastRecordItem.routeName;
          router.push({ name: lastRecordItem.routeName });
        });
      }
    };
    const selectRecordRoute = (item: RouteRecordItemType): void => {
      activeRecordRouteName.value = item.routeName;
      activeNavRouteName.value = item.routeName;
      router.push({ name: item.routeName });
    };
    /**
     * 初始化加载
     */
    onMounted(() => {
      console.log(route.matched);
      // length 1 打开左侧菜单数据第一项
      // length 2 打开对应子菜单项
      const createRecordItem = {
        labelName: '',
        routeName: ''
      };
      if (route.matched.length > 1) {
        activeNavRouteName.value = route.matched[1].name as string;
        createRecordItem.labelName = route.matched[1].meta.title as string;
        createRecordItem.routeName = route.matched[1].name as string;
        activeRecordRouteName.value = route.matched[1].name as string;
      } else {
        const treeFindRouteName = (arr: Array<NavMenuType>): any => {
          for (let i = 0, l = arr.length; i < l; i++) {
            if (arr[i].children && (arr[i].children as Array<NavMenuType>).length > 0) {
              return treeFindRouteName(arr[i].children as Array<NavMenuType>);
            } else {
              return arr[i];
            }
          }
        };
        const backItem = treeFindRouteName(leftMenuData);
        activeNavRouteName.value = backItem.routeName as string;
        activeRecordRouteName.value = backItem.routeName as string;
        createRecordItem.labelName = backItem.navLable;
        createRecordItem.routeName = backItem.routeName;
        router.push({ name: activeNavRouteName.value });
      }
      // 添加路由记录
      nextTick(() => {
        store.dispatch('addRouteRecord', createRecordItem);
      });
    });
    /**
     * 监听路由参数变化
     */
    watch(
      () => route.params,
      (newVal) => {
        activeClassifyProp.value = newVal.classifyType as string;
      }
    );
    return {
      leftMenuExpandStatus,
      changeLeftExpand,
      classifyArr,
      activeClassifyProp,
      switchClassify,
      leftMenuData,
      activeNavRouteName,
      leftNavClick,
      childRouteRecordData,
      deleteRecordData,
      selectRecordRoute,
      activeRecordRouteName
    };
  },
  beforeRouteEnter() {
    // 清空路由记录
    // store.dispatch('clearRouteRecord');
  }
});
</script>

<style lang="scss">
@import '../../styles/variable';
$yellowBtnBgColor: #fd910c;
.platform-page {
  display: flex;
  flex-direction: column;
  background-color: $pageBgColor;
  // header
  .header-wrp {
    position: relative;
    flex: 0 0 50px;
    height: 0;
    background-color: $topBgColor;
    background-image: url('../../assets/images/top_right_bg.png');
    background-repeat: no-repeat;
    background-position: center right;
    line-height: 50px;
    .left-logo {
      margin-left: 16px;
    }
    .center-search {
      position: absolute;
      top: 8px;
      left: 50%;
      margin-left: -109px;
      width: 218px;
      height: auto;
    }
    .right-user {
      float: right;
      margin-right: 148px;
      height: 100%;
      width: auto;
    }
  }
  // 模块类
  .menus-row {
    flex: 0 0 36px;
    height: 0;
    margin-top: 2px;
    background-color: #f8f8f8;
    border-top: 1px solid #dcdde2;
    box-shadow: 0 1px 2px 1px #dcdde2;
    display: flex;
    align-items: center;
    .expand-btn {
      flex: 0 0 60px;
      width: 0;
      text-align: center;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      cursor: pointer;
      .iconfont {
        font-size: 22px;
        color: #333;
      }
      &:hover {
        background-color: $yellowBtnBgColor;
        .iconfont {
          color: #fff;
        }
      }
    }
    .classify-wrp {
      flex: 1 1 auto;
      width: 0;
      overflow-x: auto;
      display: flex;
      align-items: center;
    }
  }
  // 主窗口
  .content-wrp {
    flex: 1 1 auto;
    height: 0;
    overflow: hidden;
    display: flex;
    margin-top: 3px;
    .content-left {
      flex: 0 0 auto;
    }
    .content-right {
      flex: 1 1 auto;
      padding-top: 2px;
      padding-left: 16px;
      display: flex;
      flex-direction: column;
      .child-route-tag {
        flex: 0 0 auto;
      }
      .child-router-view {
        flex: 1 1 auto;
      }
    }
  }
}
</style>
