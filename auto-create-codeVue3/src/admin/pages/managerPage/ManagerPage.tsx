import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import style from './style.module.scss';
import sysApi from '@/admin/api/index';
import { pageConfig, PageItemType } from '@/pageConfig/index';
import { Button as AntButton } from 'ant-design-vue';
import { LoginOutlined as AntLoginOutlined, PlusOutlined as AntPlusOutlined } from '@ant-design/icons-vue';
import { ElDialog, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import { utils } from '@/utils';

interface FormState {
  fileName: string;
  pageDesc: string;
}
export default defineComponent({
  name: 'ManagerPage',
  components: {
    AntButton,
    AntLoginOutlined,
    AntPlusOutlined,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
  },
  setup() {
    const router = useRouter();
    // 创建页面
    const configData = reactive<Array<PageItemType>>(pageConfig.data);
    const modalVisible = ref<boolean>(false);
    const formState: FormState = reactive({
      fileName: '',
      pageDesc: ''
    });
    // 返回首页
    const backHome = () => {
      router.push('/home');
    };
    // 添加
    const addPage = () => {
      modalVisible.value = true;
    };
    // 确认添加
    const sureBtnClick = () => {
      if (formState.fileName && formState.pageDesc) {
        const postData: PageItemType = {
          id: new Date().getTime(),
          fileName: formState.fileName,
          pageDesc: formState.pageDesc,
          children: []
        };
        sysApi.postAddPage(postData).then((res) => {
          if (res.code === 200) {
            utils.showErrorMessage('操作成功');
          }
        });
      }
    };
    // 预览
    const previewPage = (fileName: string) => {
      router.push({ name: fileName });
    };
    // 编辑
    const editPage = (pageId: number) => {
      console.log(pageId);
      router.push({ name: 'EditPage', params: { pageId } });
    };
    // 删除
    const delPage = (id: number, fileName: string) => {
      const postData = {
        fileId: id,
        fileName: fileName
      };
      sysApi.postDelPage(postData).then((res) => {
        if (res.code === 200) {
          utils.showErrorMessage('操作成功');
        }
      });
    };
    return () => {
      return (
        <div class={`root-page ${style['page-wrp']}`}>
          <header class={style['page-wrp-header']}>
            <AntButton type="primary" onClick={backHome}>
              <AntLoginOutlined></AntLoginOutlined>
              返回首页
            </AntButton>
          </header>
          <div class={style['page-wrp-content']}>
            <div class={`${style['gird']} ${style['gird-add']}`} onClick={addPage}>
              <AntPlusOutlined />
              添加
            </div>
            {/* config page list */}
            {configData.map((item) => {
              return (
                <div class={style.gird}>
                  {item.pageDesc}
                  <div class={style['gird-handle']}>
                    <span class={style['show-text']} onClick={() => previewPage(item.fileName)}>
                      预览
                    </span>
                    <span class={style['show-text']} onClick={() => editPage(item.id)}>
                      编辑
                    </span>
                    <span class={style['show-text']} onClick={() => delPage(item.id, item.fileName)}>
                      删除
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* add modal */}
          <ElDialog
            modelValue={modalVisible.value}
            title="添加页面"
            width={720}
            append-to-body={true}
            closeOnClickModal={false}
            showClose={false}
          >
            <ElForm model={formState} labelWidth="110px">
              <ElFormItem label="文件名称">
                <ElInput v-model={formState.fileName}></ElInput>
              </ElFormItem>
              <ElFormItem label="页面描述">
                <ElInput v-model={formState.pageDesc}></ElInput>
              </ElFormItem>
              <ElFormItem>
                <ElButton type="primary" onClick={sureBtnClick}>
                  添加
                </ElButton>
                <ElButton onClick={() => (modalVisible.value = false)}>取消</ElButton>
              </ElFormItem>
            </ElForm>
          </ElDialog>
        </div>
      );
    };
  }
});
