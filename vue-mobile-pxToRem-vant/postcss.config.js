module.exports = ({file}) => {
  let rootValue;
  if (file && file.dirname && file.dirname.indexOf('vant') > -1) {
    rootValue = 37.5 // vant 37.5
  } else {
    rootValue = 100
  }
  return {
    plugins: {
      'autoprefixer': {},
      'postcss-pxtorem': {
        rootValue: rootValue,//结果为：设计稿以750px为宽度,把页面宽度设计为1rem=100px
        // 插件会转化所有的样式的px。比如引入了三方UI，也会被转化。忽略转换正则匹配项
        // 如果个别地方不想转化px。可以简单的使用大写的 PX 或 Px 。
        selectorBlackList:[],
        propList: ['*']
      }
    }
  }
}
