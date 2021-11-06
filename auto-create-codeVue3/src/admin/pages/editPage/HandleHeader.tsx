import { defineComponent, PropType } from 'vue';
import style from './style.module.scss';
interface PropsType {
  onSave?: () => void;
}
export default defineComponent({
  name: 'HandleHeader',
  props: {
    onSave: {
      type: Function as PropType<() => void>,
      required: false
    }
  },
  setup(props: PropsType) {
    // 保存
    const saveClick = () => {
      props.onSave && props.onSave();
    };
    return () => (
      <div class={style['top-flex-content']}>
        <el-Button type="primary" size="small" disabled>
          回退
        </el-Button>
        <el-button type="primary" size="small" disabled>
          删除
        </el-button>
        <el-button type="primary" size="small" disabled>
          重置
        </el-button>
        <el-button type="primary" size="small" onClick={saveClick}>
          保存
        </el-button>
      </div>
    );
  }
});
