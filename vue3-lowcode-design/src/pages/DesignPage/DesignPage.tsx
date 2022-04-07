import { defineComponent, provide, reactive, ref, toRef, watch } from 'vue';
import { ElButtonGroup, ElButton } from 'element-plus';
import { useMaterialRegister, IRenderNodeType } from '@/utils/index';
import MaterialList from '@/designView/MaterialList';
import KEditor from '@/designView/KEditor';
import { DesignSetting, ISettingPropDataType } from '@/designSettings/index';
import { useDragEvent } from '@/designView/useDragEvent';
import { useSelectMaterial } from '@/designView/useSelectMaterial';
import { useCMDEvent } from '@/designView/useCMDEvent';
import { useBuildSetting } from '@/designView/useBuildSetting';
import { OnlinePreview } from '@/designFeature/OnlinePreview/index';
import style from './style.module.scss';

interface IPageDescType {
  pJs: {
    [methodKey: string]: string;
  }[];
  pCss: string;
  pJson: Array<IRenderNodeType>;
}

export default defineComponent({
  components: {
    ElButtonGroup,
    ElButton,
    MaterialList,
    KEditor,
    DesignSetting
  },
  setup() {
    const { componentRegisterList, componentRegisterMap } = useMaterialRegister();
    // 暴露注册信息
    provide('materialList', reactive(componentRegisterList));
    provide('materialMap', reactive(componentRegisterMap));
    const pageDescribe = reactive<IPageDescType>({
      pJs: [],
      pCss: '',
      pJson: []
    });
    const editorData = toRef(pageDescribe, 'pJson');
    // 暴露画布Vdom
    provide('editorData', editorData);
    // 当前被拖拽组件key
    const dragKey = ref<string>('');
    // 选中画布节点id
    const selectNodeId = ref<number>(-1);
    // 属性设置区数据
    const settingPropAreaData = reactive<ISettingPropDataType>({
      propArr: [],
      id: 0
    });
    const { buildSettingData } = useBuildSetting(componentRegisterMap, editorData);
    /**
     * @description 切换选中nodeid
     *
     * @param {number} newId
     */
    function changeSelectNodeId(newId: number, come: string) {
      if (selectNodeId.value !== newId) {
        // 属性区数据
        buildSettingData(newId, settingPropAreaData);
      }
      selectNodeId.value = newId;
    }
    const { materialDragStart, materialDragOver, materialDragDrop } = useDragEvent(
      editorData,
      dragKey,
      changeSelectNodeId
    );
    const { selectMaterial, resizeMaterialProp } = useSelectMaterial(
      componentRegisterMap,
      editorData,
      changeSelectNodeId
    );
    const { copyData } = useCMDEvent(editorData, changeSelectNodeId);
    // 观察画布数据
    watch(editorData, (newVal) => {
      console.log(newVal);
    });
    return () => (
      <div class={style['design-page']}>
        {/* header */}
        <header class={style['flex-header']}>
          <div class={style['flex-header-left']}>
            <h5>Web Lowcode Design</h5>
          </div>
          <div class={style['flex-header-center']}>
            <ElButtonGroup>
              <ElButton>回退</ElButton>
              <ElButton onClick={() => OnlinePreview(editorData)}>预览</ElButton>
              <ElButton>源码</ElButton>
              <ElButton>Dom结构</ElButton>
              <ElButton>JSON</ElButton>
              <ElButton>保存</ElButton>
            </ElButtonGroup>
          </div>
          <div class={style['flex-header-right']}></div>
        </header>
        {/* 主窗口 */}
        <main class={style['flex-content']}>
          <div class={style['flex-content-left']}>
            <MaterialList onMaterialDragStart={materialDragStart}></MaterialList>
          </div>
          <div class={style['flex-content-center']}>
            <KEditor
              canvasData={editorData.value}
              activeNodeId={selectNodeId.value}
              onEditCanvasMaterialClick={selectMaterial}
              onEditCanvasDragOver={materialDragOver}
              onEditCanvasDrop={(e) => materialDragDrop(e, componentRegisterMap)}
              onEditCanvasCopyNode={copyData}
            ></KEditor>
          </div>
          <div class={style['flex-content-right']}>
            <DesignSetting
              resizeProp={settingPropAreaData}
              resizeId={selectNodeId.value}
              resizeChange={resizeMaterialProp}
            ></DesignSetting>
          </div>
        </main>
      </div>
    );
  }
});
