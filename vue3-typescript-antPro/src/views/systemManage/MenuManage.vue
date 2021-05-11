<template>
  <ElCard shadow="hover" class="mainCard">
    <ElForm :inline="true" label-suffix="：" size="small">
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="菜单名称">
            <ElInput v-model="queryInfo.menuName" placeholder="请输入菜单名称" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="状态">
            <Selector v-model="queryInfo.menuStatus" placeholder="请选择状态" :selectOptions="statusOptions()" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="">
            <ElButton type="danger" icon="el-icon-search" @click="handleQuery">搜索</ElButton>
            <ElButton type="info" icon="el-icon-refresh-left" @click="handleClear">重置</ElButton>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <ElTable
      size="small"
      :data="tableData"
      border
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      default-expand-all
      max-height="680px"
      style="height: 680px"
      :header-cell-style="{ background: '#F5F5F5', color: '#000000' }"
    >
      <ElTableColumn type="selection" header-align="center" align="center" />
      <ElTableColumn prop="menuName" label="菜单名称" header-align="center"></ElTableColumn>
      <ElTableColumn label="图标" header-align="center" align="center">
        <template #default="scope">
          <span :class="`icon iconfont icon-${scope.row.menuIcon}`" style="font-size: 26px"></span>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="authMark" label="权限标识" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="roleRank" label="角色排序" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="route" label="组件路径" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="createDate" label="创建时间" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn label="状态" header-align="center" align="center">
        <template #default="scope">
          {{ statusLabel(scope.row.menuStatus) }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" header-align="center" align="center" width="300" fixed="right">
        <template #default="scope">
          <ElButton type="text" icon="el-icon-plus" @click="handleAdd(scope.row)">新增</ElButton>
          <ElButton type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</ElButton>
          <span v-show="!scope.row.isRoot" style="margin-left: 10px">
            <ElPopconfirm
              confirmButtonText="确定"
              cancelButtonText="取消"
              icon="el-icon-warning-outline"
              iconColor="#d30102"
              title="是否确定删除？"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <ElButton type="text" icon="el-icon-delete">删除</ElButton>
              </template>
            </ElPopconfirm>
          </span>
        </template>
      </ElTableColumn>
    </ElTable>
    <ElPagination
      background
      layout="prev, pager, next"
      :total="page.total"
      :page-size="page.size"
      :current-page="page.current"
      @current-change="handleQuery"
    />
  </ElCard>
  <ElDialog v-model="visible" :destroy-on-close="true">
    <template v-slot:title>
      <div class="dialogHeader" />
      <div class="dialogTitle">{{ dialogTitle }}</div>
      <ElDivider />
    </template>
    <ElForm :inline="true" label-suffix="：" label-width="120px" size="small">
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="上级菜单">
            <TreeSelector
              v-model="formData.upperMenu"
              :treeProps="{ key: 'id', label: 'menuName', children: 'children' }"
              :treeOptions="tableData"
              placeholder="请选择上级菜单"
              style="width: 655px"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="菜单类型">
            <Selector v-model="formData.menuType" :selectOptions="typeOptions()" placeholder="请选择菜单类型" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="菜单图标">
            <IconSelector v-model="formData.menuIcon" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="菜单顺序">
            <ElInputNumber
              v-model="formData.menuRank"
              controls-position="right"
              :min="0"
              :step="1"
              :step-strictly="true"
              style="width: 200px"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="菜单名称">
            <ElInput v-model="formData.menuName" placeholder="请输入菜单名称" clearable />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="是否外链">
            <Selector
              v-model="formData.isOutLink"
              :selectOptions="linkOptions()"
              placeholder="请选择是否外链"
              clearable
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="路由地址">
            <ElInput v-model="formData.routerAddr" placeholder="请输入路由地址" clearable />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <div v-show="formData.menuType === '3'">
        <ElRow>
          <ElCol :span="12">
            <ElFormItem label="组件路径">
              <ElInput v-model="formData.cpnAddr" placeholder="请输入组件路径" clearable />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="权限标识">
              <ElInput v-model="formData.authMark" placeholder="请输入权限标识" clearable />
            </ElFormItem>
          </ElCol>
        </ElRow>
      </div>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="显示状态">
            <Selector v-model="formData.showStatus" :selectOptions="showOptions()" placeholder="请选择显示状态" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="是否缓存">
            <Selector v-model="formData.isCache" :selectOptions="cacheOptions()" placeholder="请选择是否缓存" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="菜单状态">
            <Selector v-model="formData.menuStatus" :selectOptions="statusOptions()" placeholder="请选择菜单状态" />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <template v-slot:footer>
      <ElButton type="danger" @click="handleFinish">保存</ElButton>
      <ElButton type="info" @click="handleCancel">取消</ElButton>
    </template>
  </ElDialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from 'vue';
import {
  ElCard,
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElPopconfirm,
  ElDialog,
  ElDivider
} from 'element-plus';
import util from '@/utils/sysManage';
import Selector from '@/components/systemManage/Selector.vue';
import TreeSelector from '@/components/systemManage/TreeSelector.vue';
import IconSelector from '@/components/systemManage/IconSelector.vue';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import tableDataSamp from '@/views/systemManage/tempData/menuTableData.json';

type queryInfoType = {
  menuName: string;
  menuStatus: string;
};

type tableRowType = {
  id: number;
  deptName: string;
  sort: number;
  status: string;
  createDate: string;
};

type pageType = {
  total: number;
  size: number;
  current: number;
};

type formType = {
  upperMenu: number;
  menuType: string;
  menuIcon: string;
  menuName: string;
  menuRank: number;
  isOutLink: string;
  routerAddr: string;
  cpnAddr: string;
  authMark: string;
  showStatus: string;
  isCache: string;
  menuStatus: string;
};

export default defineComponent({
  components: {
    ElCard,
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElPopconfirm,
    ElDialog,
    ElDivider,
    Selector,
    TreeSelector,
    IconSelector
  },
  mounted() {
    this.handleQuery();
  },
  setup() {
    const visible = ref<boolean>(false);
    const statusOptions = () => {
      return [
        {
          value: '1',
          label: '状态1'
        },
        {
          value: '2',
          label: '状态2'
        },
        {
          value: '3',
          label: '状态3'
        }
      ];
    };
    const typeOptions = () => {
      return [
        {
          value: '1',
          label: '一级菜单'
        },
        {
          value: '2',
          label: '模块'
        },
        {
          value: '3',
          label: '功能'
        },
        {
          value: '4',
          label: '按钮'
        }
      ];
    };
    const linkOptions = () => {
      return [
        {
          value: '1',
          label: '是'
        },
        {
          value: '2',
          label: '否'
        }
      ];
    };
    const showOptions = () => {
      return [
        {
          value: '1',
          label: '显示'
        },
        {
          value: '2',
          label: '隐藏'
        }
      ];
    };
    const cacheOptions = () => {
      return [
        {
          value: '1',
          label: '是'
        },
        {
          value: '2',
          label: '否'
        }
      ];
    };
    const statusLabel = (val: string) => util.getLabelByValue(statusOptions(), val);
    const queryInfo = reactive<queryInfoType>({ menuName: '', menuStatus: '' });
    const tableLoading = ref<boolean>(false);
    const tableData = ref(tableDataSamp);
    const handleQuery = () => {
      tableLoading.value = true;
      console.log('query');
      console.log(queryInfo);
    };
    const handleClear = () => {
      queryInfo.menuName = '';
      queryInfo.menuStatus = '';
    };
    const page = reactive<pageType>({
      total: 100,
      size: 10,
      current: 3
    });
    const dialogTitle = ref<string>('');
    const formData = reactive<formType>({
      upperMenu: 103,
      menuType: '',
      menuIcon: '',
      menuName: '',
      menuRank: 0,
      isOutLink: '',
      routerAddr: '',
      cpnAddr: '',
      authMark: '',
      showStatus: '',
      isCache: '',
      menuStatus: ''
    });
    const handleEdit = (row: tableRowType) => {
      dialogTitle.value = '修改菜单';
      visible.value = true;
      console.log(row);
    };
    const handleAdd = (row: tableRowType) => {
      dialogTitle.value = '添加菜单';
      visible.value = true;
      console.log(row);
    };
    const handleDelete = (rowId: number) => {
      console.log('delete---' + rowId);
    };
    const handleSubmit = () => {
      console.log(formData);
      visible.value = false;
    };
    const handleFinish = () => {
      console.log('finish');
      handleSubmit();
    };
    const handleCancel = () => {
      visible.value = false;
    };
    watch(
      () => formData.menuType,
      () => {
        if (formData.menuType !== '3') {
          formData.cpnAddr = '';
          formData.authMark = '';
        }
      }
    );
    return {
      visible,
      statusOptions,
      typeOptions,
      linkOptions,
      showOptions,
      cacheOptions,
      statusLabel,
      queryInfo,
      tableLoading,
      tableData,
      handleQuery,
      handleClear,
      handleEdit,
      handleAdd,
      handleDelete,
      page,
      dialogTitle,
      formData,
      handleSubmit,
      handleFinish,
      handleCancel
    };
  }
});
</script>
<style lang="scss">
@import '@/components/systemManage/styles/index.scss';
.mainCard {
  margin-top: 10px;
  margin-right: 10px;
  width: 1660px;
}
</style>
