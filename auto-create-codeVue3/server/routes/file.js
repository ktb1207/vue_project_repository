const express = require('express');
const fs = require('fs');
const path = require('path');
const mineType = require('mime-types');

const file = express.Router();

const imageFileUrl = path.join(path.resolve(), 'src', 'assets', 'images');
function errInfo(code, err = '', msg = '服务器异常') {
  return {
    code: code,
    msg: msg,
    errorData: err
  };
}
function successInfo(code, data) {
  return {
    code: code,
    msg: 'success',
    data
  };
}
file.get('/image', (req, res) => {
  const fileName = req.query.imageName;
  if (fileName) {
    const fileUrl = path.resolve(imageFileUrl, fileName);
    fs.stat(fileUrl, (err, stats) => {
      if (err) {
        res.status(200).send(errInfo(500, 'no such file or directory', '不存在图片文件')).end();
        return;
      }
      if (stats.isFile) {
        fs.readFile(fileUrl, 'base64', (err, data) => {
          if (err) {
            res.status(500).send(errInfo(500, err)).end();
            return;
          }
          res.status(200).send(successInfo(200, { dataSrc: `data:${mineType.lookup(fileUrl)};base64,${data}` }));
        });
      }
    });
  } else {
    res.status(400).send(errInfo(400, '', '缺少请求参数'));
  }
});

module.exports = file;
