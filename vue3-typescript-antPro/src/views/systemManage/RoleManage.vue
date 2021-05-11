<template>
  <ElCard shadow="hover" class="mainCard">
    <ElForm :inline="true" label-suffix="：" size="small">
      <ElRow>
        <ElCol :span="6">
          <ElFormItem label="角色名称">
            <ElInput v-model="queryInfo.roleName" placeholder="请输入角色名称" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="权限字符">
            <ElInput v-model="queryInfo.authStr" placeholder="请输入权限字符" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="6">
          <ElFormItem label="状态">
            <Selector v-model="queryInfo.roleStatus" placeholder="请选择状态" :selectOptions="statusOptions()" />
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
    <div style="margin: 10px">
      <ElButton size="small" type="danger" icon="el-icon-plus" @click="handleAdd()">新增</ElButton>
      <ElButton size="small" type="danger" icon="el-icon-delete" @click="handleDelete(true)">删除</ElButton>
      <ElButton size="small" type="danger" icon="el-icon-upload2" @click="handleOutput()">导出</ElButton>
    </div>
    <ElTable
      size="small"
      :data="tableData"
      border
      row-key="id"
      @selection-change="handleSelectionChange"
      style="height:630px"
      :header-cell-style="{ background: '#F5F5F5', color: '#000000' }"
    >
      <ElTableColumn type="selection" header-align="center" align="center" />
      <ElTableColumn prop="roleId" label="角色编号" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="roleName" label="角色名称" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="authStr" label="权限字符" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="roleRank" label="角色排序" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn prop="createDate" label="创建时间" header-align="center" align="center"></ElTableColumn>
      <ElTableColumn label="状态" header-align="center" align="center">
        <template #default="scope">
          {{ statusLabel(scope.row.roleStatus) }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" header-align="center" align="center" width="300" fixed="right">
        <template #default="scope">
          <ElButton type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</ElButton>
          <ElButton type="text" icon="el-icon-circle-check" @click="handleAuth(scope.row)">数据权限</ElButton>
          <ElPopconfirm
            confirmButtonText="确定"
            cancelButtonText="取消"
            icon="el-icon-warning-outline"
            iconColor="#d30102"
            title="是否确定删除？"
            @confirm="handleDelete(false, scope.row.roleId)"
          >
            <template #reference>
              <ElButton type="text" icon="el-icon-delete">删除</ElButton>
            </template>
          </ElPopconfirm>
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
    <ElForm :inline="true" label-suffix="：" label-width="100px" size="small">
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="角色编号">
            <ElInput v-model="formData.roleId" placeholder="请输入角色编号" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="角色名称">
            <ElInput v-model="formData.roleName" placeholder="请输入角色名称" clearable />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="权限字符">
            <ElInput v-model="formData.authStr" placeholder="请输入权限字符" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="角色顺序">
            <ElInputNumber v-model="formData.roleRank" controls-position="right" :min="0" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="角色状态">
            <Selector v-model="formData.roleStatus" :selectOptions="statusOptions()" placeholder="请选择状态" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="菜单权限">
            <ElTree
              :data="menuTreeData()"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="menuTree"
              :props="{ children: 'children', label: 'menuName' }"
            ></ElTree>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="备注">
            <ElInput v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入内容" style="width:680px" />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <template v-slot:footer>
      <ElButton type="danger" @click="handleFinish">保存</ElButton>
      <ElButton type="info" @click="handleCancel">取消</ElButton>
    </template>
  </ElDialog>
  <ElDialog v-model="auth" :destroy-on-close="true">
    <template v-slot:title>
      <div class="dialogHeader" />
      <div class="dialogTitle">分配数据权限</div>
      <ElDivider />
    </template>
    <ElForm :inline="true" label-suffix="：" label-width="100px" size="small">
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="角色名称">
            <ElInput v-model="authInfo.roleName" disabled />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="权限字符">
            <ElInput v-model="authInfo.authStr" disabled />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="权限范围">
            <Selector v-model="authInfo.authRange" :selectOptions="authOptions()" placeholder="请选择权限范围" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <div v-show="authInfo.authRange === '2'">
        <ElRow>
          <ElCol :span="24">
            <ElFormItem label="数据权限">
              <ElTree
                :data="deptTreeData()"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="deptTree"
                :props="{ children: 'children', label: 'label' }"
              ></ElTree>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </div>
    </ElForm>
    <template v-slot:footer>
      <ElButton type="danger" @click="handleFinishAuth">保存</ElButton>
      <ElButton type="info" @click="handleCancelAuth">取消</ElButton>
    </template>
  </ElDialog>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import {
  ElCard,
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElTree,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElDialog,
  ElDivider,
  ElPopconfirm,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import util from '@/utils/sysManage';
import Selector from '@/components/systemManage/Selector.vue';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import tableDataSamp from '@/views/systemManage/tempData/roleTableData.json';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import treeDataSamp from '@/views/systemManage/tempData/menuTableData.json';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import treeDataSamp2 from '@/views/systemManage/tempData/treeData.json';

type queryInfoType = {
  roleName: string;
  authStr: string;
  roleStatus: string;
};

type tableRowType = {
  id: number;
  roleId: string;
  roleName: string;
  authStr: string;
  roleRank: number;
  createDate: string;
  roleStatus: string;
  menuAuth: Array<string>;
};

type pageType = {
  total: number;
  size: number;
  current: number;
};

type formType = {
  roleId: string;
  roleName: string;
  authStr: string;
  roleRank: number;
  roleStatus: string;
  menuAuth: Array<string>;
  remark: string;
};

type authType = {
  roleName: string;
  authStr: string;
  authRange: string;
  dataAuth?: Array<number>;
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
    ElTree,
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElDialog,
    ElDivider,
    ElPopconfirm,
    Selector
  },
  mounted() {
    this.handleQuery();
  },
  setup() {
    const visible = ref<boolean>(false);
    const auth = ref<boolean>(false);
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
    const authOptions = () => {
      return [
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '自定数据权限'
        },
        {
          value: '3',
          label: '本部门数据权限'
        },
        {
          value: '4',
          label: '本部门及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        }
      ];
    };
    const statusLabel = (val: string) => util.getLabelByValue(statusOptions(), val);
    const queryInfo = reactive<queryInfoType>({ roleName: '', authStr: '', roleStatus: '' });
    const tableLoading = ref<boolean>(false);
    const tableData = ref(tableDataSamp);
    const handleQuery = () => {
      tableLoading.value = true;
      console.log('query');
      console.log(queryInfo);
    };
    const handleClear = () => {
      queryInfo.roleName = '';
      queryInfo.authStr = '';
      queryInfo.roleStatus = '';
    };
    const dialogTitle = ref<string>('');
    const formData = reactive<formType>({
      roleId: '',
      roleName: '',
      authStr: '',
      roleRank: 0,
      roleStatus: '',
      menuAuth: [],
      remark: ''
    });
    const menuTree = ref(null);
    const menuTreeData = () => {
      return treeDataSamp;
    };
    const selectedData = ref<Array<tableRowType>>([]);
    const handleSelectionChange = (rows: Array<tableRowType>) => {
      selectedData.value = rows;
      console.log(rows);
    };
    const handleEdit = (row: tableRowType) => {
      dialogTitle.value = '修改角色';
      // (menuTree.value as any).setCheckedKeys([100]);
      visible.value = true;
      console.log(row);
    };
    const handleAdd = () => {
      dialogTitle.value = '添加角色';
      visible.value = true;
    };
    const handleDelete = (multi: boolean, rowId: string) => {
      if (multi) {
        if (!selectedData.value.length) {
          ElMessage.warning('请至少选择一条数据');
        } else {
          ElMessageBox.confirm('是否确认删除所选数据?', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              console.log('delete');
            })
            .catch(() => {});
        }
      } else {
        console.log('delete ---' + rowId);
      }
    };
    const handleOutput = () => {
      console.log('output');
    };
    const handleSubmit = () => {
      console.log(formData);
      visible.value = false;
    };
    const handleFinish = () => {
      console.log('finish');
      formData.menuAuth = (menuTree.value as any).getCheckedKeys();
      handleSubmit();
    };
    const handleCancel = () => {
      visible.value = false;
    };
    const authInfo = reactive<authType>({
      roleName: '',
      authStr: '',
      authRange: '',
      dataAuth: []
    });
    const deptTree = ref(null);
    const deptTreeData = () => {
      return treeDataSamp2;
    };
    const handleAuth = (row: tableRowType) => {
      authInfo.roleName = row.roleName;
      authInfo.authStr = row.authStr;
      auth.value = true;
    };
    const handleSubmitAuth = () => {
      console.log(authInfo);
      auth.value = false;
    };
    const handleFinishAuth = () => {
      console.log('finish');
      authInfo.dataAuth = (deptTree.value as any).getCheckedKeys();
      handleSubmitAuth();
    };
    const handleCancelAuth = () => {
      auth.value = false;
    };
    const page = reactive<pageType>({
      total: 100,
      size: 10,
      current: 3
    });
    return {
      visible,
      auth,
      statusOptions,
      authOptions,
      statusLabel,
      queryInfo,
      tableLoading,
      tableData,
      handleQuery,
      handleClear,
      dialogTitle,
      formData,
      menuTree,
      menuTreeData,
      selectedData,
      handleSelectionChange,
      handleEdit,
      handleAdd,
      handleDelete,
      handleOutput,
      handleSubmit,
      handleFinish,
      handleCancel,
      authInfo,
      deptTree,
      deptTreeData,
      handleAuth,
      handleSubmitAuth,
      handleFinishAuth,
      handleCancelAuth,
      page
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
