
import { Notify } from 'vant';
const util = {};
/**
 * 页面添加title的方法
 */
util.title = function(title = 'Glodon BIM5D') {
  window.document.title = title;
};

// 判断是否是数字
util.isNumber = function(val) {
  var regPos = /^\d+(\.\d+)?$/; // 非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  }
  return false;
};
// 格式化时间格式
util.changeDateFormat = function(date, type = '-') {
  if (!date || date === null || date === '') {
    return '';
  }
  date = typeof date !== 'object' ? new Date(date) : date;
  const year = date.getFullYear();
  const month =
    parseInt(date.getMonth() + 1) > 9
      ? date.getMonth() + 1
      : '0' + '' + (date.getMonth() + 1);
  const day =
    parseInt(date.getDate()) > 9 ? date.getDate() : '0' + '' + date.getDate();
  return `${year}${type}${month}${type}${day}`;
};
// 获取时间毫秒数
util.getDateMs = function(date) {
  if (!date) {
    return '';
  }
  return new Date(date).getTime();
};
// 获取当前日期的上一个月的日期
util.getPreMonthDate = function(date) {
  if (!date) {
    return '';
  }
  const nowDate = new Date(date);
  const preDate = nowDate.setMonth(nowDate.getMonth() - 1);
  return preDate;
};
// 格式化时间
util.newDateFormat = function(date, type = '-') {
  if (!date || date === 'null' || date === '') {
    return '';
  }
  date = new Date(Number(date));
  const year = date.getFullYear();
  const month =
    parseInt(date.getMonth() + 1) > 9
      ? date.getMonth() + 1
      : '0' + '' + (date.getMonth() + 1);
  const day =
    parseInt(date.getDate()) > 9 ? date.getDate() : '0' + '' + date.getDate();
  if (type === 'month') {
    return `${year}年${month}月`;
  } else if (type === 'day') {
    return `${year}年${month}月${day}日`;
  }
  return `${year}${type}${month}${type}${day}`;
};
// 分页数据
util.slicePage = function(data, currentPage, pageSize) {
  let array = [];
  let startNum = 0;
  let endNum = 0;
  const total = data.length;
  startNum = (currentPage - 1) * pageSize;
  if (currentPage * pageSize < total) {
    endNum = currentPage * pageSize;
  } else {
    endNum = total;
  }
  array = data.slice(startNum, endNum);
  return array;
};

// 深度拷贝数组
util.deepCopyArray = function(arr) {
  const createArr = [];
  for (var i = 0; i < arr.length; i++) {
    const res = {};
    for (var key in arr[i]) {
      res[key] = arr[i][key];
    }
    createArr.push(res);
  }
  return createArr;
};
// 判断是否为空对象
util.isEmptyObj = function(obj) {
  for (var k in obj) {
    return false;
  }
  return true;
};
util.findTreeList = function(treeArr, id) {
  for (var i in treeArr) {
    if (treeArr[i].id === id) {
      return treeArr[i];
    }
    util.findTreeList(treeArr[i].children, id);
  }
};
// 系统提示
util.waring = function(msg) {
  Notify({ type: 'warning', message: msg});
};
util.success = function(msg) {
  Notify({ type: 'success', message: msg });
};
util.error = function(msg) {
  Notify({ type: 'danger', message: msg });
};

export default util;
