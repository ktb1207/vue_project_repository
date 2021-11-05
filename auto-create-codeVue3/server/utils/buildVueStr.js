/**
 * 构建树数据
 **/
function buildTreeData(arr, uniqueId = 'id', parentIdName = 'parentId') {
  let treeArr = [];
  const map = {};
  arr.forEach((item) => {
    item.children = [];
    if (!map[item[uniqueId]]) {
      map[item[uniqueId]] = item;
    }
  });
  arr.forEach((item) => {
    if (item[parentIdName] !== null) {
      if (map[item[parentIdName]]) {
        map[item[parentIdName]].children.push(item);
      }
    }
  });
  // 过滤后仅剩下根节点
  const filterArr = arr.filter((item) => {
    if (item[parentIdName] === null) {
      return item;
    }
  });
  treeArr = [...filterArr];
  return treeArr;
}
function getStartTag(key) {
  return '<' + key;
}
function getEndTag(key) {
  return '</' + key + '>';
}
function getPropValue(propArr) {
  var propStr = '';
  propArr.forEach((val) => {
    if (val.propKey === 'nodeId') {
      console.log('过滤不需要组件属性');
    } else if (val.propKey === 'showWay') {
      // propStr += ' ' + val.propKey + '=' + '"' + 'show' + '"';
      propStr += ' ' + val.propKey + '=' + '"' + val.propValue + '"';
    } else {
      propStr += ' ' + val.propKey + '=' + '"' + val.propValue + '"';
    }
  });
  return propStr;
}
function createHtmlDomByJson(arr) {
  var saveHtml = '';
  arr.forEach((el) => {
    saveHtml += getStartTag(el.key) + getPropValue(el.props);
    if (typeof el.children === 'string') {
      saveHtml += '>' + el.children + getEndTag(el.key);
    } else if (typeof el.children === 'object' && el.children.length > 0) {
      saveHtml += '>' + createHtmlDomByJson(el.children) + getEndTag(el.key);
    } else {
      saveHtml += '>' + getEndTag(el.key);
    }
  });
  return saveHtml;
}
function createComponentStrByArr(dataArr) {
  const getTreeData = buildTreeData(JSON.parse(JSON.stringify(dataArr)));
  const getHtmlStr = createHtmlDomByJson(getTreeData);
  return getHtmlStr;
}

module.exports = function (name, dataArr) {
  return `
<template>
  <div>${createComponentStrByArr(dataArr)}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: '${name}'
});
</script>
`;
};
