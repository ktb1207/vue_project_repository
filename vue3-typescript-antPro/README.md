# vue-typescript-pc

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Compiles and minifies for test
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

##### 权限说明
[一、路由全局守卫]()
- 错误路由跳转至404
- 访问页面需要登录并且当前状态未登录，跳转登录页
- 已登录状态访问登录页，重定首页

[二、页面级]()
- 根据页面权限标识在store查找是否包含当前页面权限标识，无权限标识跳转403

[三、跟应用]
- App创建载入依据local信息判断登录状态是否过期，过期清空local登录信息
