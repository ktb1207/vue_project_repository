import { defineComponent, PropType, reactive, VNode, toRef, createVNode, watch, onMounted } from 'vue';
import { ResizeType, ISettingPropDataType } from './index';
import KSPText from './formItem/KSPText';
import KSPButton from './formItem/KSPButton';
import KSPSelect from './formItem/KSPSelect';
import KSPColor from './formItem/KSPColor';
import style from './style.module.scss';

export default defineComponent({
  name: 'DesignSetting',
  props: {
    resizeProp: {
      type: Object as PropType<ISettingPropDataType>,
      default: () => ({
        propArr: [],
        id: 0
      }),
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
    KSPText,
    KSPButton,
    KSPColor,
    KSPSelect
  },
  setup(props) {
    const componentMap = {
      text: KSPText,
      color: KSPColor,
      select: KSPSelect,
      button: KSPButton
    };
    const propVnode = reactive<Array<VNode>>([]);
    const resizePropArr = toRef(props, 'resizeProp');

    function valueChange(key: string, value: string | number) {
      console.log(key + '---' + value);
      props.resizeChange && props.resizeChange(props.resizeId, key, value);
    }

    /**
     * @description 构造属性设置项
     * */
    function createPropVnode(propArr: Array<ResizeType>, uniqueId: number): void {
      propVnode.splice(0);
      propArr.forEach((item) => {
        propVnode.push(
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
        createPropVnode(resizePropArr.value?.propArr as Array<ResizeType>, newValue as number);
      }
    );

    onMounted(() => {
      createPropVnode(resizePropArr.value?.propArr as Array<ResizeType>, resizePropArr.value?.id as number);
    });

    return () => (
      <div>
        <h5>属性设置</h5>
        {propVnode.map((item) => item)}
      </div>
    );
  }
});
