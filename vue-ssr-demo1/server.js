const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer();
const express = require('express');
const server = express();
const port = 3000;
const createApp = require('./dist/bundle.server.js')['default'];

server.listen(port, () => console.log(`server is runing http://localhost:3000`));

// 创建vue实例
const app = new Vue({
  template: '<div>hello vue ssr</div>'
})

// 相应路由请求
server.get('*', function (req,res) {
  const context = { url: req.url }
  // 服务端渲染的核心就在于：通过vue-server-renderer插件的renderToString()方法，将Vue实例转换为字符串插入到html文件
  // renderer.renderToString(app, (err,html) => {
  //   if (err) {
  //     return res.state(500).end('运行时错误')
  //   }
  //   res.send(`
  //     <!DOCTYPE html>
  //     <html lang="en">
  //         <head>
  //             <meta charset="UTF-8">
  //             <title>Vue2.0 SSR渲染页面</title>
  //         </head>
  //         <body>
  //             ${html}
  //         </body>
  //     </html>
  //   `)
  // })
  // 创建vue实例，传入请求路由信息
    createApp(context).then(app => {
        renderer.renderToString(app, (err, html) => {
            if (err) { return res.state(500).end('运行时错误') }
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Vue2.0 SSR渲染页面</title>
                    </head>
                    <body>
                        ${html}
                    </body>
                </html>
            `)
        })
    }, err => {
        if(err.code === 404) { res.status(404).end('所请求的页面不存在') }
    })
})

