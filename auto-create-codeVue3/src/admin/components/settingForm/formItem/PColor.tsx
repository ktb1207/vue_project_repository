import { defineComponent } from 'vue';
import style from './style.module.scss';
export default defineComponent({
  name: 'PColor',
  setup() {
    return () => (
      <div class={style.propItem}>
        <div class={style.propLable}>标题</div>
        <div>
          <input type="color" class={style.propInput} />
        </div>
      </div>
    );
  }
});
