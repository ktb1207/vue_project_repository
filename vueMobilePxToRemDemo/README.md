# vue-cli 配置less
    ++ npm install less --save-dev
    ++ npm install less-loader --save-dev
# vue-cli babel-polyfill
    ++ npm install babel-polyfill
# 自己实现px转rem
    ++ pxToRem.js
    ++ less文件头部定义：@rem:100rem;100为基数
# 采用淘宝方案lib-flexible.js
    ++ npm install lib-flexible --save-dev
    ++ main.js --import 'lib-flexible/flexible'
    ++ npm install px2rem-loader --save-dev
    ++ 配置 build/utils.js 参考：https://blog.csdn.net/z1712636234/article/details/77881685/
