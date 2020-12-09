
const path = require('path');

//__filename是模块内的变量，代表当前文件
// __dirname 可以用来获取当前文件模块所属目录的绝对路径 两个都是动态的
// __filename 可以用来获取当前文件的绝对路径




/**
 * 
 * 
 * path 模块详解
 * 由于windows和其他系统之间路径不统一,path 模块提供了一些工具函数，用于处理文件与目录的路径
 * path模块还专门做了相关处理，屏蔽了彼此之间的差异。
*/

/**
 * windows系统和类Unix系统的路径的区别
 * windows是分不同的磁盘，然后磁盘下面都是树状结构的文件和文件夹。
 * 而类Unix（Unix、Linux）系统中是不分盘符的，只有一个根目录 /， 都是都是这个下面的子目录或者文件，当然也是树状的机构。
 * 
 * windows是用反斜杠\分割目录或者文件的:C:\temp\myfile.html
 * 在类Unix的系统中是用的/:/tmp/myfile.html
*/

/**
 * path.basename(path[, ext])--获取路径中的文件名
 * 
 * path <string> 完整文件名路径
 * ext <string> 可选的文件扩展名
 * 返回: <string> 文件名
*/
path.basename('/foo/bar/baz/asdf/quux.html'); // quux.html

path.basename('/foo/bar/baz/asdf/quux.html', '.html'); // 去掉后缀输出文件名 quux


/**
 * 
 * path.dirname(path)--获取路径的文件夹目录
 * path <string> ，要返回路径的变量
 * 返回: <string>
 * 
*/
path.dirname('/foo/bar/baz/asdf/quux.html'); // /foo/bar/baz/asdf


/**
 * 
 * path.extname(path)--获取路径的扩展名
 * 方法返回 path 的扩展名，即从 path 的最后一部分中的最后一个 .（句号）字符到字符串结束。
 * 如果 path 的最后一部分没有 . 或 path 的文件名的第一个字符是 .，则返回一个空字符串。
*/
path.extname('/etc/a/index.html'); // .html
path.extname('index.coffee.md'); // .md
path.extname('index.'); // .
path.extname('index'); // ''
path.extname('.index'); // ''


/**
 * path.format()--格式化一个路径
 * 方法会从一个对象返回一个路径字符串。
 * 
 * path.format(pathObject)
 * pathObject.dir <string> 所在目录
 * pathObject.root <string> 根目录
 * pathObject.base <string> 文件全名
 * pathObject.name <string> 文件名字（不带后缀）
 * pathObject.ext <string> 文件后缀
 * 
 * 返回: <string> 返回完整路径字符串
*/
path.format({
  dir: '/home/user/dir',
  base: 'file.txt'
}); // '/home/user/dir/file.txt'

path.format({
  root: '/',
  name: 'file',
  ext: '.txt'
});
// 返回: '/file.txt'


/**
 * 
 * path.parse()--把路径字符串转换成对象
 * 方法返回一个对象，对象的属性表示 path 的元素
 * parse方法跟 format方法正好相反
 * 
*/
path.parse('/users/home/aicoder/a.html');
/**
 * { root: '/',
      dir: '/users/home/aicoder',
      base: 'a.html',
      ext: '.html',
      name: 'a' 
    }
*/

/**
*
*path.join()--连接多个路径
*
*方法使用平台特定的分隔符把全部给定的 path 片段连接到一起，并规范化生成的路径。
*
*
*
**/
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'); // 返回: '/foo/bar/baz/asdf'
path.join('/foot', __filename); // 返回：/foot/xxx.js 
// __filename是模块内的变量，代表当前js文件

// 以下路径拼接的方式不推荐：
var strPath = '/foot/' + 'xxx.js';  
// 不推荐路径直接进行字符串拼接，毕竟win和POSIX系统路径有区别



/**
*
*path.relative(from, to)--获取相对路径
*
*方法返回从 from 到 to 的相对路径（基于当前工作目录）
*
*
*如果 from 和 to 各自解析到同一路径（调用 path.resolve()），则返回一个长度为零的字符串。
*
*如果 from 或 to 传入了一个长度为零的字符串，则当前工作目录会被用于代替长度为零的字符串。
*
*
**/
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'); // 返回: '../../impl/bbb'


/**
*
*path.resolve()--智能解析绝对路径
*
*方法会把一个路径或路径片段的序列解析为一个绝对路径。
**
*规则：
*1.给定的路径的序列是从右往左被处理的，后面每个 path 被依次解析，直到构造完成一个绝对路径。
*
*2.如果处理完全部给定的 path 片段后还未生成一个绝对路径，则当前工作目录会被用上。
*
*3.生成的路径是规范化后的，且末尾的斜杠会被删除，除非路径被解析为根目录。
*
*4.长度为零的 path 片段会被忽略。
*
*5.如果没有传入 path 片段，则 path.resolve() 会返回当前工作目录的绝对路径。
*
**/

/**
*
*path.normalize()--对路径字符串进行规范化
*
*
*方法会规范化给定的 path，并解析 '..' 和 '.' 片段。
*
*当发现多个连续的路径分隔符时（如 POSIX 上的 / 与 Windows 上的 \ 或 /），
*它们会被单个的路径分隔符（POSIX 上是 /，Windows 上是 \）替换。 末尾的多个分隔符会被保留。
*
**/
path.normalize('/foo/bar//baz/asdf/quux/..'); // '/foo/bar/baz/asdf


/**
*
*path.isAbsolute(path)--判断是否是绝对路径
*此方法接受一个字符串，返回boolean类型。
*
**/
