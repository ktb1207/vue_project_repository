const Vue = require('vue');
const express = require('express');
const fs = require('fs');
const path = require('path');
const vueServerRenderer = require('vue-server-renderer');
const server = express();

const serverApp = require('./src/entry-server.js');
const port = 3000;

server.listen(port, () => console.log(`server is runing http://localhost:3000`));

// 1.创建一个renderer
const renderer = vueServerRenderer.createRenderer({
  template:fs.readFileSync('./template/index.html', 'utf-8') // 使用模板
})

// 渲染上下文对象，作为 renderToString 函数的第二个参数，来提供插值数据
const context = {
  title: 'vue ssr demo',
  metas: `
    <meta name="keyword" content="vue,ssr">
    <meta name="description" content="vue srr demo">
  `
}
// 与服务端集成
server.get('*', async(req,res) => {
  let {url} = req;
  // 2.创建一个vue实例
  let vm = await serverApp({url})
  // 3.将vue实例渲染为html
  renderer.renderToString(vm, context, (err,html) => {
    if (err) {
      res.status(500).end('Internal Server Error');
      return;
    }
    res.status(200);
    res.setHeader("Content-Type","text/html;charset=utf-8")
    res.send(html); // html 将是注入应用程序内容的完整页面
  })
})