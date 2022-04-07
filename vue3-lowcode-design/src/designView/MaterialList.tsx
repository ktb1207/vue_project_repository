import { defineComponent, inject } from 'vue';
import { IRegisterComponentType, IRenderNodeType } from '@/utils/index';
import { ElButton } from 'element-plus';

export default defineComponent({
  emits: ['materialDragStart'],
  components: {
    ElButton
  },
  setup(props, { emit }) {
    const materialList = inject<Array<IRegisterComponentType>>('materialList', []);
    const dragStart = (e: DragEvent, render: IRenderNodeType, renderId: number) => {
      emit('materialDragStart', e, render, renderId);
    };
    return () => (
      <div>
        <ul>
          {materialList.map(
            (item) =>
              item.isShowAtMaterialList && (
                <li draggable onDragstart={(e) => dragStart(e, item.render, item.render.id)}>
                  <h3>{item.label}</h3>
                  <ElButton type="primary" disabled>
                    {item.preview()}
                  </ElButton>
                </li>
              )
          )}
        </ul>
      </div>
    );
  }
});
