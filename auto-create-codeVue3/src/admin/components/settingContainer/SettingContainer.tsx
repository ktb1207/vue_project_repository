import { defineComponent, toRef, ref, watch } from 'vue';
import KInput from '@/admin/components/kInput/KInput';

export default defineComponent({
  name: 'SettingContainer',
  emits: ['update:width', 'update:height'],
  props: {
    width: {
      type: String,
      required: false,
      default: '600'
    },
    height: {
      type: String,
      required: false,
      default: '600'
    }
  },
  components: {
    KInput
  },
  setup(props, { emit }) {
    const containerW = toRef(props, 'width');
    const containerH = toRef(props, 'height');
    const modelW = ref<string>(containerW.value);
    const modelH = ref<string>(containerH.value);
    watch(
      () => modelW.value,
      (val) => {
        emit('update:width', val);
      }
    );
    watch(
      () => modelH.value,
      (val) => {
        emit('update:height', val);
      }
    );
    return () => (
      <div class="setting-block">
        <h5>预览容器</h5>
        <div class="s-row">
          <div class="col-fixed-w">宽度：</div>
          <div class="col-auto-w">
            <KInput type="text" v-model={modelW.value}></KInput>
          </div>
        </div>
        <div class="s-row">
          <div class="col-fixed-w">高度：</div>
          <div class="col-auto-w">
            <KInput v-model={modelH.value}></KInput>
          </div>
        </div>
      </div>
    );
  }
});
