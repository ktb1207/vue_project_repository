import { defineComponent, PropType, createVNode, toRef, watch, VNode, reactive, onMounted } from 'vue';
import style from './style.module.scss';
import PText from './formItem/PText';
import PSelect from './formItem/PSelect';
import PColor from './formItem/PColor';
export interface ResizeType {
  resizeFormItem: 'text' | 'select' | 'color';
  resizeTitle: string;
  propKey: string;
  propValue: string | number;
  propSelect: string | number | Array<string>;
}

interface ReactiveProp {
  propArr: Array<ResizeType>;
  id: number;
}
export default defineComponent({
  name: 'SettingForm',
  props: {
    resizeProp: {
      type: Object as PropType<ReactiveProp>,
      required: false
    },
    resizeId: {
      type: Number,
      default: 0,
      required: false
    },
    resizeChange: {
      type: Function as PropType<(id: number, key: string, value: string | number) => void>,
      required: false
    }
  },
  components: {
    PText,
    PSelect,
    PColor
  },
  setup(props) {
    const componentMap = {
      text: PText,
      color: PColor,
      select: PSelect
    };
    const vProp = reactive<Array<VNode>>([]);
    function valueChange(key: string, value: string | number) {
      console.log(key + '---' + value);
      props.resizeChange && props.resizeChange(props.resizeId, key, value);
    }
    const resizePropArr = toRef(props, 'resizeProp');
    /**
     * @description 构造属性设置项
     * */
    function createPropVnode(propArr: Array<ResizeType>, uniqueId: number): void {
      vProp.splice(0);
      console.log(propArr);
      propArr.forEach((item) => {
        vProp.push(
          createVNode(componentMap[item.resizeFormItem], {
            key: uniqueId + item.propKey,
            label: item.resizeTitle,
            labelValue: item.propValue,
            valueKey: item.propKey,
            valueSelect: item.propSelect,
            onItemChange: (key: string, value: string | number) => valueChange(key, value)
          })
        );
      });
    }
    watch(
      () => resizePropArr.value?.id,
      (newValue) => {
        console.log(newValue);
        createPropVnode(resizePropArr.value?.propArr as Array<ResizeType>, newValue as number);
      }
    );
    onMounted(() => {
      createPropVnode(resizePropArr.value?.propArr as Array<ResizeType>, resizePropArr.value?.id as number);
    });
    return () => (
      <div class={style.settingForm}>
        <h5>属性设置</h5>
        {vProp.map((item) => item)}
      </div>
    );
  }
});
