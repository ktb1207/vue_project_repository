import { onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { mainStorekey } from '@/store/index';
function useAuthority(targetKey: string): void {
  const store = useStore(mainStorekey);
  const router = useRouter();
  onBeforeMount(() => {
    if (!store.state.limitPage.includes(targetKey)) {
      // 权限标识不存在
      router.push({
        name: 'Forbidden'
      });
    }
  });
}

export default useAuthority;
