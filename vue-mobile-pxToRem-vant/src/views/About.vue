<template>
  <div class="about">
    <h3>vue 基础脚手架配置说明</h3>
    <ol>
      <li>第三方组件库element-ui按需引入</li>
      <li>配置采用axios数据获取</li>
      <li>采用prettier格式化代码风格，需要vscode安装插件</li>
      <li>使用eslint检查代码规范并在保存时自动修复,需要vscode安装eslint插件</li>
      <li>env环境区分</li>
      <li>vue.config.js配置项目启动默认打开路由页面：theDefaultRouter</li>
      <li>src>styles对应全局样式修改</li>
    </ol>
  </div>
</template>

<style lang="less">
  .about{
    padding:36px;
    font-size:32px;
    h3{
      font-weight: 600;
    }
    li{
      list-style:decimal;
    }
  }
</style>
