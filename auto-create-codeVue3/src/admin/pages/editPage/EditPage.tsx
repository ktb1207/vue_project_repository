import { defineComponent, ref, provide, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import './index.scss';
import style from './style.module.scss';
import SettingContainer from '@/admin/components/settingContainer/SettingContainer';
import SettingForm, { ResizeType } from '@/admin/components/settingForm/SettingForm';
import { ComponentPropType, registerConfig as config } from '@/admin/utils/EditRegister';
import { pageConfig, PageItemType, ElementType } from '@/pageConfig/index';
import KEditor from './KEditor';
import HandleHeader from './HandleHeader';
import { useMaterialDrag } from './useMaterialDrag';
import { EventBus } from '@/admin/utils/Eventbus';
import { utils } from '@/admin/utils/index';
import sysApi from '@/admin/api/index';
export default defineComponent({
  name: 'EditPage',
  components: {
    SettingContainer,
    HandleHeader,
    SettingForm
  },
  setup() {
    provide('config', config); // 注册组件信息
    const activeDragKey = ref<string>('');
    provide('dragKey', activeDragKey); // 当前拖拽组件key
    const activeComponentId = ref<number>(999999);
    provide('editId', activeComponentId);
    const route = useRoute();
    // 预览
    const previewW = ref<string>('880');
    const previewH = ref<string>('780');
    // 调整项prop
    const activeComponentProp = reactive<{
      propArr: Array<ResizeType>;
      id: number;
    }>({
      propArr: [],
      id: 0
    });
    // 从页面配置数据中心找出对应编辑页面数据
    const pageId = route.params.pageId;
    let pageName = '';
    let KPTextChangeValue = '';
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
    /**
     * @description 监听KP文本内容编辑
     *
     */
    EventBus.$on('commentTextEdit', 'KP', (data: any) => {
      // for (let i = 0, l = editorData.length; i < l; i++) {
      //   if (editorData[i].id === data.targetId) {
      //     editorData[i].children = data.textValue as string;
      //   }
      // }
      KPTextChangeValue = data.textValue;
    });
    /**
     * @description 选中编辑组件
     * @param {id} 组件id
     * */
    const editComponentClick = (id: number, propArr: Array<ComponentPropType>): void => {
      activeComponentId.value = id;
      activeComponentProp.propArr.splice(0);
      activeComponentProp.id = id;
      let inx = 0;
      for (let i = 0, l = editorData.length; i < l; i++) {
        if (editorData[i].id === id) {
          inx = i;
          break;
        }
      }
      propArr.forEach((item: ComponentPropType) => {
        const obj: ResizeType = {
          resizeFormItem: item.resizeFormItem ?? 'text',
          resizeTitle: item.resizeTitle ?? '',
          propKey: item.propKey,
          propSelect: item.propSelect ?? '',
          propValue: ''
        };
        editorData[inx].props.forEach((val) => {
          if (val.propKey === item.propKey) {
            obj.propValue = val.propValue;
          }
        });
        activeComponentProp.propArr.push(obj);
      });
    };
    /**
     * @description 编辑
     * */
    const editPreComponent = (editId: number, editKey: string, newValue: string | number) => {
      for (let i = 0, l = editorData.length; i < l; i++) {
        if (editorData[i].id === editId) {
          if (editKey === 'children') {
            editorData[i].children = KPTextChangeValue;
          } else {
            // 处理组件后期新增props
            const propList: Array<string> = [];
            editorData[i].props.forEach((item) => {
              propList.push(item.propKey);
            });
            const inPropListIndex = propList.findIndex((value) => {
              return value === editKey;
            });
            if (inPropListIndex > -1) {
              editorData[i].props[inPropListIndex].propValue = newValue;
            } else {
              const addPropsItem = config.componentMap[editorData[i].key].render.props.filter((value) => {
                return value.propKey === editKey;
              });
              addPropsItem.length > 0 ? (addPropsItem[0].propValue = newValue) : null;
              editorData[i].props.push(...addPropsItem);
            }
          }
          break;
        }
      }
    };
    /**
     * 保存页面信息
     * */
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
          {/* 预览控制 */}
          <SettingContainer
            v-models={[
              [previewW.value, 'width'],
              [previewH.value, 'height']
            ]}
          ></SettingContainer>
          {/* 属性调整 */}
          <SettingForm
            resizeProp={activeComponentProp}
            resizeId={activeComponentId.value}
            resizeChange={editPreComponent}
          ></SettingForm>
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
              <KEditor editData={editorData} onComponentClick={editComponentClick}></KEditor>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
