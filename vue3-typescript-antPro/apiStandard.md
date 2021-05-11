### 接口规范
---

[一、接口请求方式]()

+ get:查询数据
+ post:提交数据
数据格式：
   - 普通数据：Content-Type：application/json
   - 文件：Content-Type：multipart/form-data
+ delete删除数据

[二、响应规范]()

```js
{
  code: 200,
  data: [] / {}
  message: '这是一条消息'
}
```

响应数据状态说明：
+ code 200，正确请求并成功响应
+ code 错误码，请求成功但存在请求异常，如无权限操作，message提示相应消息
+ 其它http status 500,401,403

相应数据格式说明:

+ 响应数据为list： data:[]
+ 响应数据为map: data:{}
强调说明：map项假如存在某一字段没有值，改字段要在map结构存在并返回，其值可为null

[三、其它说明]()

+ 前后端时间格式全部采用timestamp格式：1619661413369