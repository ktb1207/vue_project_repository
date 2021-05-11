import './index.scss';
import { defineComponent, toRef, ref, watch } from 'vue';

type CheckStatus = 'checked' | 'unChecked' | 'halfChecked';
interface Props {
  disabled?: boolean;
  checkStatus?: CheckStatus;
  onCheckChange?: (val: boolean) => {};
}

export default defineComponent({
  name: 'KCheckbox',
  emits: ['CheckChange'],
  props: {
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    checkStatus: {
      type: String,
      default: 'unChecked',
      required: false
    },
    onCheckChange: {
      type: Function,
      required: false,
      default: (val: boolean) => {}
    }
  },
  setup(props, { emit }) {
    const originStatus = toRef(props, 'checkStatus');
    const originDisabled = toRef(props, 'disabled');
    const nowStatus = ref<string>(props.checkStatus);
    // 选中切换
    const changeCheckedStatus = (status: string) => {
      if (status === 'checked') {
        nowStatus.value = 'unChecked';
      } else {
        nowStatus.value = 'checked';
      }
      const boolStatus = nowStatus.value === 'checked' ? true : false;
      emit('CheckChange', boolStatus);
    };
    // 监听选中状态
    watch(originStatus, () => {
      console.log('新值' + originStatus.value);
      nowStatus.value = originStatus.value;
    });
    return {
      nowStatus,
      originDisabled,
      changeCheckedStatus
    };
  },
  render() {
    const checkStatus = this.nowStatus;
    const disabledStatus = this.originDisabled;
    console.log(disabledStatus);
    function getWrpInput() {
      if (checkStatus === 'unChecked') {
        return 'checkbox-input un-checked';
      } else if (checkStatus === 'checked') {
        return 'checkbox-input is-checked';
      } else {
        return 'checkbox-input half-checked';
      }
    }
    function getInnerInput() {
      if (checkStatus === 'unChecked' && disabledStatus) {
        return 'checkbox-inner un-checked is-disabled';
      } else if (checkStatus === 'unChecked') {
        return 'checkbox-inner un-checked';
      } else if (checkStatus === 'checked' && disabledStatus) {
        return 'checkbox-inner is-checked is-disabled';
      } else if (checkStatus === 'checked') {
        return 'checkbox-inner is-checked';
      } else if (checkStatus === 'halfChecked' && disabledStatus) {
        return 'checkbox-inner half-checked is-disabled';
      } else {
        return 'checkbox-inner half-checked';
      }
    }
    return (
      <label class="k-checkbox-wrp">
        <span class={getWrpInput()} onClick={() => this.changeCheckedStatus(checkStatus)}>
          <span class={getInnerInput()}></span>
        </span>
      </label>
    );
  }
});
