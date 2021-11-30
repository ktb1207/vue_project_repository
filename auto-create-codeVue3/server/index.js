const express = require('express');
const bodyParser = require('body-parser');
const page = require('./routes/page');
const file = require('./routes/file');

const server = express();
const port = 8088;

// post 解析以 application/json 和 application/x-www-form-urlencoded 提交的数据
// application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: false }));
// application/json
server.use(bodyParser.json());

// 路由模块
server.use('/api/page', page);
server.use('/api/file', file);
server.get('/', (req, res) => {
  res.send('this is node server for file');
});

server.listen(port, () => console.log(`node server is runing at http://localhost:${port}`));
