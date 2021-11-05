const express = require('express');
const fs = require('fs');
const path = require('path');
const buildVueStr = require('../utils/buildVueStr');
const page = express.Router();
// 页面配置json文件路径
const configFileUrl = path.join(path.resolve(), 'src', 'pageConfig', 'pageConfig.json');
// 自动生成页面存放目录
const createPageUrl = path.join(path.resolve(), 'src', 'autoCreatePage');
// vue模板
const templateUrl = path.join(path.resolve(), 'server', 'template', 'EmptyVue.vue');
// 自动生成路由文件路径
const createRouterUrl = path.join(path.resolve(), 'src', 'router', 'autoCreateRouter.json');
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
/**
 * 添加页面
 **/
page.post('/add', (req, res) => {
  const { id, fileName, pageDesc, children } = req.body;
  // 文件名首字母大写
  const upperFileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
  const addPageInfo = { id, fileName: upperFileName, pageDesc, children };
  fs.stat(configFileUrl, (err, stats) => {
    if (err) {
      res.status(500).send(errInfo(500, err)).end();
      return;
    }
    if (stats.isFile) {
      // 读取配置文件
      fs.readFile(configFileUrl, 'utf8', (err, data) => {
        if (err) {
          res.status(500).send(errInfo(500, err)).end();
          return;
        }
        const fileData = JSON.parse(data);
        // 检查添加页面是否存在
        let isExist = false;
        fileData.data.forEach((item) => {
          if (item.fileName === fileName) {
            isExist = true;
          }
        });
        if (!isExist) {
          fileData.data.push(addPageInfo);
          fileData.total += 1;
          // 写入文件
          const fileStr = JSON.stringify(fileData, null, '\t');
          fs.writeFile(configFileUrl, fileStr, 'utf8', (err) => {
            if (err) {
              res.status(500).send(errInfo(500, err)).end();
            } else {
              res.status(200).send(successInfo(200, fileStr)).end();
            }
          });

          // 创建.vue文件
          fs.readFile(templateUrl, 'utf8', (err, data) => {
            if (err) {
              console.log('读取vue模板文件失败');
              console.log(err);
              return;
            }
            // 替换模板占位符
            const dataStr = data.replace(/empty/g, pageDesc);
            fs.writeFile(path.resolve(createPageUrl, `${upperFileName}.vue`), dataStr, (err) => {
              if (err) {
                console.log('创建vue文件失败');
                console.log(err);
              }
            });
          });
          // 自动路由配置
          fs.readFile(createRouterUrl, 'utf8', (err, data) => {
            if (err) {
              console.log('读取自动配置路由文件失败');
              return;
            }
            const routerArr = JSON.parse(data);
            routerArr.routerArr.push({
              path: `/${fileName}`,
              name: upperFileName,
              meta: {
                title: pageDesc
              }
            });
            const routerStr = JSON.stringify(routerArr, null, '\t');
            fs.writeFile(createRouterUrl, routerStr, (err) => {
              if (err) {
                console.log('自动创建路由配置失败');
              }
            });
          });
        } else {
          res.status(200).send(errInfo(201, '', '已存在相同页面文件')).end();
        }
      });
    }
  });
});
/**
 * 删除页面
 **/
page.post('/deletePage', (req, res) => {
  const { fileId, fileName } = req.body;
  // 删除pageConfig数据
  fs.stat(configFileUrl, (err, stats) => {
    if (err) {
      res.status(500).send(errInfo(500, err)).end();
      return;
    }
    // 读取配置文件
    if (stats.isFile) {
      fs.readFile(configFileUrl, 'utf8', (err, data) => {
        if (err) {
          res.status(500).send(errInfo(500, err)).end();
          return;
        }
        const fileData = JSON.parse(data);
        fileData.data.forEach((item, index) => {
          if (item.id === Number(fileId)) {
            fileData.data.splice(index, 1);
            fileData.total -= 1;
          }
        });
        // 写入文件
        const fileStr = JSON.stringify(fileData, null, '\t');
        fs.writeFile(configFileUrl, fileStr, 'utf8', (err) => {
          if (err) {
            res.status(500).send(errInfo(500, err)).end();
          }
        });
      });
    }
  });
  // 删除路由
  fs.stat(createRouterUrl, (err, stats) => {
    if (err) {
      res.status(500).send(errInfo(500, err)).end();
      return;
    }
    if (stats.isFile) {
      fs.readFile(createRouterUrl, 'utf8', (err, data) => {
        if (err) {
          res.status(500).send(errInfo(500, err)).end();
          return;
        }
        const fileData = JSON.parse(data);
        fileData.routerArr.forEach((item, index) => {
          if (item.name === fileName) {
            fileData.routerArr.splice(index, 1);
          }
        });
        // 写入文件
        const fileStr = JSON.stringify(fileData, null, '\t');
        fs.writeFile(createRouterUrl, fileStr, 'utf8', (err) => {
          if (err) {
            res.status(500).send(errInfo(500, err)).end();
            return;
          }
        });
      });
    }
  });
  // 删除页面文件
  fs.stat(path.resolve(createPageUrl, `${fileName}.vue`), (err, stats) => {
    if (err) {
      res.status(500).send(errInfo(500, err)).end();
      return;
    }
    if (stats.isFile) {
      fs.unlink(path.resolve(createPageUrl, `${fileName}.vue`), (err) => {
        if (err) {
          res.status(500).send(errInfo(500, err)).end();
          return;
        }
        res
          .status(200)
          .send(successInfo(200, JSON.stringify({})))
          .end();
      });
    }
  });
});
/**
 * 保存页面修改
 **/

page.post('/editSave', (req, res) => {
  const { fileId, pageName, pageData } = req.body;
  // 检查页面id是否存在
  fs.stat(configFileUrl, (err, stats) => {
    if (err) {
      res.status(500).send(errInfo(500, err)).end();
      return;
    }
    if (stats.isFile) {
      // 读取配置文件
      fs.readFile(configFileUrl, 'utf8', (err, data) => {
        if (err) {
          res.status(500).send(errInfo(500, err)).end();
          return;
        }
        const fileData = JSON.parse(data);
        // 检查添加页面是否存在
        let isExist = false;
        fileData.data.forEach((item) => {
          if (Number(item.id) === Number(fileId)) {
            isExist = true;
            item.children = [...pageData];
          }
        });
        if (isExist) {
          // 构建vue文件字符
          const getVueHtmlStr = buildVueStr(pageName, pageData);

          // 写入json文件
          const fileStr = JSON.stringify(fileData, null, '\t');
          fs.writeFile(configFileUrl, fileStr, 'utf8', (err) => {
            if (err) {
              res.status(500).send(errInfo(500, err)).end();
            }
          });
          // 创建.vue文件
          fs.stat(path.resolve(createPageUrl, `${pageName}.vue`), (err, stats) => {
            if (err) {
              res.status(500).send(errInfo(500, err)).end();
              return;
            }
            if (stats.isFile) {
              // 写入vue文件
              fs.writeFile(path.resolve(createPageUrl, `${pageName}.vue`), getVueHtmlStr, (err) => {
                if (err) {
                  res.status(500).send(errInfo(500, err, '写入vue文件出错')).end();
                  return;
                }
                res.status(200).send(successInfo(200, 'success', [])).end();
              });
            }
          });
        } else {
          res.status(200).send(errInfo(201, '', 'fileId参数错误')).end();
        }
      });
    }
  });
});
module.exports = page;
