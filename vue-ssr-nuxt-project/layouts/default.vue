<template>
  <div class="default-layout">
    <header>
      <div class="project-logo">
        <Logo />
      </div>
      <div class="route-bar">
        <div class="link-wrp">
          <nuxt-link to="/">首页</nuxt-link>
          <nuxt-link to="/about">关于</nuxt-link>
        </div>
        <div class="user-center">
          <p v-if="isLogin">用户名：{{ userName }}</p>
          <button v-else @click="openLogin">未登录</button>
        </div>
      </div>
    </header>
    <div class="nuxt-page">
      <Nuxt />
    </div>
    <!-- 登录dialog -->
    <el-dialog
      title="登录"
      :visible.sync="dialogVisible"
      center
      :show-close="false"
      width="460px"
    >
      <div>
        <el-input
          v-model="loginName"
          placeholder="用户名"
          label="用户名"
        ></el-input>
        <el-input
          v-model="loginWord"
          placeholder="密码"
          label="密码"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '../api/index'
import Logo from '../components/Logo'
export default {
  components: {
    Logo,
  },
  data() {
    return {
      isLogin: false,
      userName: '',
      dialogVisible: false,
      loginName: '',
      loginWord: '',
      loginToken: '',
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.autoLogin()
    })
  },
  methods: {
    openLogin() {
      this.loginName = ''
      this.loginWord = ''
      this.dialogVisible = true
    },
    // 登录
    async submitInfo() {
      const postData = {
        accountId: this.loginName,
        accountPwd: this.loginWord,
      }
      await this.$axios.post(api.postLogin(), postData).then((res) => {
        if (res.data.code === '200') {
          this.loginToken = res.data.data
        } else {
          this.loginToken = ''
        }
      })
      if (this.loginToken !== '') {
        await this.$axios
          .get(api.getUserInfoByToken(), {
            params: {
              flag: 'PC',
              token: this.loginToken,
            },
          })
          .then((res) => {
            if (res.data.code === '200') {
              localStorage.setItem('loginToken', res.data.data.token)
              this.isLogin = true
              this.userName = res.data.data.userName
              this.dialogVisible = false
            }
          })
      }
    },
    autoLogin() {
      const loginToken = localStorage.getItem('loginToken')
      if (loginToken) {
        this.$axios.get(api.getUserInfo()).then((res) => {
          if (res.data.code === '200') {
            this.isLogin = true
            this.userName = res.data.data.employeeName
          } else {
            localStorage.removeItem('loginToken')
          }
        })
      }
    },
  },
}
</script>
<style lang="less">
.default-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  header {
    flex: 0 0 98px;
    height: 0;
    background-color: #001938;
    color: #fff;
    display: flex;
    .project-logo {
      flex: 0 0 auto;
    }
    .route-bar {
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      .link-wrp {
        flex: 1 1 auto;
      }
      .user-center {
        flex: 0 0 auto;
      }
      a:link,
      a:visited {
        color: #fff;
      }
      a:hover {
        color: red;
      }
      a:active {
        color: #fff;
      }
    }
  }
  .nuxt-page {
    flex: 1 1 auto;
    overflow: hidden;
  }
}
</style>
