<template>
  <div class="root-router-page login-page">
    <div class="from-wrp">
      <Form :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
        <FormItem>
          <Input v-model:value="formState.user" placeholder="Username">
            <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)"/></template>
          </Input>
        </FormItem>
        <FormItem>
          <Input v-model:value="formState.password" type="password" placeholder="Password">
            <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)"/></template>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" html-type="submit" :disabled="formState.user === '' || formState.password === ''">
            Log in
          </Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, UnwrapRef } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { mainStorekey } from '@/store/index';
import { Form, Input, Button } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import util from '@/utils/index';
interface FormState {
  user: string;
  password: string;
}
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
    Form,
    FormItem: Form.Item,
    Input,
    Button
  },
  setup() {
    // router
    const router = useRouter();
    // sotre
    const store = useStore(mainStorekey);
    const formState: UnwrapRef<FormState> = reactive({
      user: '',
      password: ''
    });
    const handleFinish = (values: FormState) => {
      console.log(values);
      console.log(formState);
      console.log(store);
      store.dispatch('showLoading', 'body');
      setTimeout(() => {
        store.dispatch('hideLoading');
      }, 2000);
      // util.setToken(formState.user + formState.password);
      // router.push({
      //   name: 'Home'
      // });
    };
    const handleFinishFailed = (errors: ValidateErrorEntity<FormState>) => {
      console.log(errors);
    };

    return {
      formState,
      handleFinish,
      handleFinishFailed
    };
  }
});
</script>

<style lang="scss" scoped>
.login-page {
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  position: relative;
  .from-wrp {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
