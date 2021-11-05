import { defineComponent, ref, provide, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import './index.scss';
import style from './style.module.scss';
import SettingContainer from '@/admin/components/settingContainer/SettingContainer';
import { registerConfig as config } from '@/admin/utils/EditRegister';
import { pageConfig, PageItemType, ElementType } from '@/pageConfig/index';
import KEditor from './KEditor';
import HandleHeader from './HandleHeader';
import useMaterialDrag from './useMaterialDrag';
import { EventBus } from '@/admin/utils/Eventbus';
import { utils } from '@/admin/utils/index';
import sysApi from '@/admin/api/index';
export default defineComponent({
  name: 'EditPage',
  components: {
    SettingContainer,
    HandleHeader
  },
  setup() {
    provide('config', config); // 注册组件信息
    const route = useRoute();
    const activeDragKey = ref<string>('');
    provide('dragKey', activeDragKey); // 当前拖拽组件key
    // 预览
    const previewW = ref<string>('880');
    const previewH = ref<string>('780');
    // 从页面配置数据中心找出对应编辑页面数据
    const pageId = route.params.pageId;
    let pageName = '';
    const editorData = reactive<Array<ElementType>>([]);
    (pageConfig.data as Array<PageItemType>).forEach((item) => {
      if (item.id === Number(pageId)) {
        pageName = item.fileName;
        item.children.forEach((val) => editorData.push(val));
      }
    });
    // 物料拖拽
    const { materialDragStart, previewDragOver, previewDrop } = useMaterialDrag(editorData, activeDragKey);
    watch(editorData, (newVal) => {
      console.log(newVal);
    });
    // 监听组件内部拖拽放置
    EventBus.$on('commentDrop', 'previewOn', (data: any) => {
      const resolveRender = utils.deepClone(config.componentMap[data.dropKey].render);
      resolveRender.id = new Date().getTime();
      resolveRender.parentId = data.targetId;
      // 添加放置组件数据
      editorData.push(resolveRender);
    });
    const saveData = () => {
      const postData = {
        fileId: pageId,
        pageName: pageName,
        pageData: editorData
      };
      sysApi.postEditSavePage(postData).then((res) => {
        console.log(res);
      });
    };
    return () => (
      <div class="edit-page">
        {/* 操作区 */}
        <div class={style['head-wrp']}>
          <HandleHeader onSave={saveData}></HandleHeader>
        </div>
        {/* 物料区 */}
        <div class={style['left-wrp']}>
          {config.componentList.map((item) => (
            <div class={style['drag-item']} draggable onDragstart={(e) => materialDragStart(e, item.render)}>
              <span>{item.label}</span>
              {item.preview()}
            </div>
          ))}
        </div>
        {/* 属性控制区 */}
        <div class={style['right-wrp']}>
          <SettingContainer
            v-models={[
              [previewW.value, 'width'],
              [previewH.value, 'height']
            ]}
          ></SettingContainer>
        </div>
        {/* 中心内容 */}
        <div class={style['content-wrp']}>
          <div class={style['overflow-scroll']}>
            <div
              class={style['center-preview']}
              style={{ width: previewW.value + 'px', height: previewH.value + 'px' }}
              onDragover={(e) => previewDragOver(e)}
              onDrop={(e) => previewDrop(e, config.componentMap)}
            >
              {/* 编辑预览 */}
              <KEditor editData={editorData}></KEditor>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
