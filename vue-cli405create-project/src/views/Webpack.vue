<style lang="less">
.webpack-wrp {
  padding: 14px 24px;
  i {
    color: red;
  }
  .demo-wrp {
    h2 {
      font-weight: 800;
    }
    h3 {
      font-weight: 600;
    }
    ol {
      li {
        list-style: decimal;
        text-indent: 24px;
      }
    }
    ul {
      li {
        list-style-type: disc;
      }
    }
  }
}
</style>

<template>
  <div class="webpack-wrp">
    <back-home></back-home>
    <div class="demo-wrp">
      <h2>关于webpack打包优化浅谈</h2>
      <p>实现webpack打包优化，有两个优化点：</p>
      <ol>
        <li>如何减少打包时间</li>
        <li>如何减少打包大小</li>
      </ol>
    </div>
    <div class="demo-wrp">
      <h3>优化打包时间</h3>
      <ol>
        <li>
          <p><i>优化Loader的搜索范围</i></p>
          <p>合理针对loader进行include,exclude配置</p>
        </li>
        <li>
          <p><i>减小第三方模块搜索范围</i></p>
          <p>Webpack的resolve.modules配置模块库（即 node_modules）所在的位置
            在 js 里出现 import 'vue' 这样不是相对、也不是绝对路径的写法时，会去 node_modules 目录下找。
            但是默认的配置，会采用向上递归搜索的方式去寻找，但通常项目目录里只有一个 node_modules，
            且是在项目根目录，为了减少搜索范围，可以直接写明 node_modules 的全路径；
          </p>
        </li>
        <li>
          <p><i>用 Happypack 来加速代码构建</i></p>
          <p>因为受限于Node的单线程运行，所以webpack的打包也是单线程的，
            使用HappyPack可以将Loader的同步执行转为并行，从而执行Loader时的编译等待时间。
          </p>
        </li>
        <li>
          <p><i>增强代码代码压缩工具</i></p>
          <p>Webpack 默认提供的 UglifyJS 插件，由于采用单线程压缩，速度颇慢 ；
            推荐采用 webpack-parallel-uglify-plugin 插件，她可以并行运行 UglifyJS 插件，
            更加充分而合理的使用 CPU 资源，这可以大大减少的构建时间；</p>
        </li>
        <li>
          <p><i>导入文件名后缀优化</i></p>
          <p>reslove.extensions:用来表明文件后缀名列表，默认查找顺序是[’.js’,’.json’],
            如果你的导入文件没有添加后缀就会按照这个顺序查找文件。我们应该尽可能减少后缀列表长度，
            然后将出现频率高的后缀排在前面。</p>
        </li>
      </ol>
    </div>
    <div class="demo-wrp">
      <h3>减小打包体积</h3>
      <ol>
        <li>
          <p><i>按需加载</i></p>
          <p>第三方组件库、路由、页面组件采用按需加载</p>
          </p>
        </li>
        <li>
          <p><i>压缩js、css;移除文件注释和console</i></p>
        </li>
        <li>
          <p><i>Gzip压缩和sourceMap优化</i></p>
        </li>
        <li>
          <p><i>tree shaking</i></p>
          <p>我们常常在文件中使用具名引入（named imports），这些引入的文件里有其他导出（exports）。
            在某些情况下，我们并没有引入所有的导出，但Webpack仍会把整个模块都导入进来。
            这种情况下就需要使用tree shaking了，因为它能帮助我们去除掉用不到的代码。
            因此打包后的体积能显著下降。</p>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import BackHome from '../components/BackHome';
export default {
  name: 'webpack',
  props: {},
  data() {
    return {};
  },
  computed: {},
  components: {
    BackHome
  },
  watch: {},
  methods: {},
  mounted() {}
};
</script>