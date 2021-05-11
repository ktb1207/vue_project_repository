<template>
  <ElCol :span="8">
    <ElCard shadow="hover" class="mainCard" style="width:300px">
      <ElInput
        v-model="filterText"
        @input="handleFilter"
        size="small"
        prefix-icon="el-icon-search"
        placeholder="请输入部门名称"
      />
      <ElTree
        :data="getTreeData()"
        :props="treeProps"
        @node-click="handleTreeClick"
        :filter-node-method="nodeFilter"
        :highlight-current="true"
        default-expand-all
        ref="orgTree"
        style="margin-top: 20px"
      />
    </ElCard>
  </ElCol>
  <ElCol :span="16">
    <ElCard shadow="hover" class="mainCard" style="width:1350px">
      <ElForm size="small" :inline="true" label-suffix="：" label-width="100px">
        <ElRow>
          <ElCol :span="8">
            <ElFormItem label="用户账号">
              <ElInput v-model="queryInfo.userAccount" placeholder="请输入用户账号" clearable />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="用户编号">
              <ElInput v-model="queryInfo.userId" placeholder="请输入用户编号" clearable />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="8">
            <ElFormItem label="姓名">
              <ElInput v-model="queryInfo.userName" placeholder="请输入用户姓名" clearable />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="状态">
              <Selector v-model="queryInfo.userStatus" :selectOptions="statusOptions()" placeholder="请选择用户状态" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="">
              <ElButton type="danger" icon="el-icon-search" @click="handleQuery(1)">搜索</ElButton>
              <ElButton type="info" icon="el-icon-refresh-left" @click="handleClear()">重置</ElButton>
            </ElFormItem>
          </ElCol>
        </ElRow>
        <div style="margin: 10px">
          <ElButton size="small" type="danger" icon="el-icon-plus" @click="handleAdd()">新增</ElButton>
          <ElButton size="small" type="danger" icon="el-icon-delete" @click="handleDelete(true)">删除</ElButton>
          <ElButton size="small" type="danger" icon="el-icon-download" @click="handleInput()">导入</ElButton>
          <ElButton size="small" type="danger" icon="el-icon-upload2" @click="handleOutput()">导出</ElButton>
        </div>
      </ElForm>
      <ElTable
        :data="tableData"
        size="small"
        row-key="id"
        border
        @selection-change="handleSelectionChange"
        style="height:580px"
        :header-cell-style="{ background: '#F5F5F5', color: '#000000' }"
      >
        <ElTableColumn type="selection" header-align="center" align="center" />
        <ElTableColumn prop="userId" label="用户编号" header-align="center" align="center"></ElTableColumn>
        <ElTableColumn prop="userAccount" label="用户账号" header-align="center" align="center"> </ElTableColumn>
        <ElTableColumn prop="userName" label="姓名" header-align="center" align="center"> </ElTableColumn>
        <ElTableColumn prop="mail" label="邮箱" header-align="center" align="center"> </ElTableColumn>
        <ElTableColumn prop="phone" label="电话" header-align="center" align="center"> </ElTableColumn>
        <ElTableColumn prop="position" label="所属岗位" header-align="center" align="center"> </ElTableColumn>
        <ElTableColumn prop="dept" label="所属机构" header-align="center" align="center"> </ElTableColumn>
        <ElTableColumn prop="role" label="所属角色" header-align="center" align="center"> </ElTableColumn>
        <ElTableColumn prop="createDate" label="创建时间" header-align="center" align="center"> </ElTableColumn>
        <ElTableColumn label="状态" header-align="center" align="center">
          <template #default="scope">
            {{ statusLabel(scope.row.userStatus) }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" header-align="center" align="center" width="240" fixed="right">
          <template #default="scope">
            <ElButton type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</ElButton>
            <ElPopconfirm
              confirmButtonText="确定"
              cancelButtonText="取消"
              icon="el-icon-warning-outline"
              iconColor="#d30102"
              title="是否确定重置？"
              @confirm="handleReset(scope.row.userId)"
            >
              <template #reference>
                <ElButton type="text" icon="el-icon-key">重置</ElButton>
              </template>
            </ElPopconfirm>
            <span v-show="!scope.row.isRoot" style="margin-left:10px">
              <ElPopconfirm
                confirmButtonText="确定"
                cancelButtonText="取消"
                icon="el-icon-warning-outline"
                iconColor="#d30102"
                title="是否确定删除？"
                @confirm="handleDelete(false, scope.row.userId)"
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
  </ElCol>
  <ElDialog v-model="visible">
    <template v-slot:title>
      <div class="dialogHeader" />
      <div class="dialogTitle">{{ dialogTitle }}</div>
      <ElDivider />
    </template>
    <ElForm :model="formData" ref="userForm" :inline="true" label-suffix="：" label-width="100px">
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="用户编号">
            <ElInput v-model="formData.userId" placeholder="请输入用户编号" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="用户账号">
            <ElInput v-model="formData.userAccount" placeholder="请输入用户账号" clearable />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="用户密码">
            <ElInput v-model="formData.password" placeholder="请输入用户密码" show-password clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="姓名">
            <ElInput v-model="formData.userName" placeholder="请输入姓名" clearable />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="电话">
            <ElInput v-model="formData.phone" placeholder="请输入电话" clearable />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="电子邮件">
            <ElInput v-model="formData.mail" placeholder="请输入电子邮件地址" clearable />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="所属机构">
            <TreeSelector v-model="formData.dept" :treeOptions="deptOptions()" placeholder="所属机构" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="所属岗位">
            <Selector v-model="formData.position" :selectOptions="positionOptions()" placeholder="请选择所属岗位" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="状态">
            <Selector v-model="formData.userStatus" :selectOptions="statusOptions()" placeholder="请选择用户状态" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow>
        <ElCol :span="24">
          <ElFormItem label="备注">
            <ElInput v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入内容" style="width:656px" />
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
import { defineComponent, ref, reactive } from 'vue';
import {
  ElCard,
  ElRow,
  ElCol,
  ElTree,
  ElForm,
  ElFormItem,
  ElInput,
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
import TreeSelector from '@/components/systemManage/TreeSelector.vue';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import treeDataSamp from '@/views/systemManage/tempData/treeData.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import userTableDataSamp from '@/views/systemManage/tempData/userTableData.json';

type treeNodeType = {
  id: number;
  value: string;
  label: string;
};

type queryInfoType = {
  userAccount: string;
  userId: string;
  userName: string;
  userStatus: string;
};

type tableRowType = {
  id: number;
  userId: string;
  userAccount: string;
  userName: string;
  mail: string;
  phone: string;
  position: string;
  dept: string;
  role: string;
  createDate: string;
  userStatus: string;
  ifRoot: boolean;
};

type pageType = {
  total: number;
  size: number;
  current: number;
};

type formType = {
  userId: string;
  userAccount: string;
  password: string;
  userName: string;
  phone: string;
  mail: string;
  dept: number;
  position: string;
  userStatus: string;
  remark: string;
};

export default defineComponent({
  components: {
    ElCard,
    ElRow,
    ElCol,
    ElTree,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElDialog,
    ElDivider,
    ElPopconfirm,
    Selector,
    TreeSelector
  },
  mounted() {
    this.handleQuery(1);
  },
  setup() {
    const visible = ref<boolean>(false);
    const treeProps = {
      children: 'children',
      label: 'label'
    };
    const getTreeData = () => {
      return treeDataSamp;
    };
    const nodeFilter = (value: string, data: treeNodeType) => {
      if (!value) {
        return true;
      }
      return data.label.indexOf(value) !== -1;
    };
    const filterText = ref<string>('');
    const orgTree = ref(null);
    const handleFilter = (val: string) => {
      (orgTree.value as any).filter(val);
    };
    const currentNode = ref<number>(0);
    const handleTreeClick = (node: treeNodeType) => {
      console.log(node);
      currentNode.value = node.id;
    };
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
    const statusLabel = (val: string) => util.getLabelByValue(statusOptions(), val);
    const queryInfo = reactive<queryInfoType>({ userAccount: '', userId: '', userName: '', userStatus: '' });
    const tableLoading = ref<boolean>(false);
    const tableData = ref<Array<tableRowType>>(userTableDataSamp);
    const handleQuery = (page: number) => {
      tableLoading.value = true;
      console.log('query---' + page);
      console.log(queryInfo);
    };
    const handleClear = () => {
      queryInfo.userAccount = '';
      queryInfo.userId = '';
      queryInfo.userName = '';
      queryInfo.userStatus = '';
    };
    const dialogTitle = ref<string>('');
    const selectedData = ref<Array<tableRowType>>([]);
    const handleSelectionChange = (rows: Array<tableRowType>) => {
      selectedData.value = rows;
      console.log(rows);
    };
    const handleAdd = () => {
      dialogTitle.value = '添加用户';
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
    const handleInput = () => {
      console.log('input');
    };
    const handleOutput = () => {
      console.log('output');
    };
    const handleEdit = (row: tableRowType) => {
      dialogTitle.value = '编辑用户';
      visible.value = true;
      console.log(row);
    };
    const handleReset = (rowId: string) => {
      console.log('reset---' + rowId);
    };
    const page = reactive<pageType>({
      total: 100,
      size: 10,
      current: 3
    });
    const deptOptions = () => {
      return treeDataSamp;
    };
    const positionOptions = () => {
      return [
        {
          value: '1',
          label: '岗位1'
        },
        {
          value: '2',
          label: '岗位2'
        },
        {
          value: '3',
          label: '岗位3'
        }
      ];
    };
    const formData = reactive<formType>({
      userId: '',
      userAccount: '',
      password: '',
      userName: '',
      phone: '',
      mail: '',
      dept: 100,
      position: '',
      userStatus: '',
      remark: ''
    });
    // const userForm = ref(null);
    const handleSubmit = () => {
      console.log(formData);
      visible.value = false;
    };
    const handleFinish = () => {
      console.log('finish');
      handleSubmit();
      // (userForm.value as any).validate((valid: boolean) => {
      //   if (valid) {
      //     handleSubmit();
      //   } else {
      //     return false;
      //   }
      // });
    };
    const handleCancel = () => {
      visible.value = false;
    };
    return {
      visible,
      treeProps,
      getTreeData,
      nodeFilter,
      filterText,
      orgTree,
      handleFilter,
      currentNode,
      handleTreeClick,
      statusOptions,
      statusLabel,
      queryInfo,
      tableLoading,
      tableData,
      handleQuery,
      handleClear,
      dialogTitle,
      handleAdd,
      handleDelete,
      handleInput,
      handleOutput,
      selectedData,
      handleSelectionChange,
      handleEdit,
      handleReset,
      page,
      deptOptions,
      positionOptions,
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
}
.tableHeader {
  background-color: #f56c6c;
}
</style>
