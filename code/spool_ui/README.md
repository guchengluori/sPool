<h1 align="center">dva模板</h1>


## 新特征

- 支持IE10+ ,safrai, chrome, firfox
- 动态国际化
- 支持区块开发

## 架构

 基于 Fish-desktop-x组件库 开发，采用如下技术

- 组件库 antd [doc](https://fish.iwhalecloud.com/fish-desktop-x/)
- 构建工具 umi2.3.0 [doc](https://umijs.org/zh/)
- 国际化框架 @fish/portal-plugin-i18n0.1.0 [doc](http://gitlab.iwhalecloud.com/fish-x/portal-plugin-i18n/blob/master/README.md)
- 集成dva框架相关redux数据流 dva2.4 [doc](https://dvajs.com/)

## 工程搭建

### 开发环境准备

node: 目前统一使用node稳定版本v10.15.2   [下载地址](https://nodejs.org/en/download/)

yarn: yarn 包管理工具  [下载地址](https://yarnpkg.com/lang/zh-hans/docs/install/#windows-tab)

nrm:  npm源管理工具，用于经常需要在公司源与公网源进行切换，安装本项目需要切换至znpm源

```shell
npm i -g @ngweb/nrm --registry http://registry.npm.ztesoft.com
# 切换到公司源
$ nrm use znpm
```

vscode: 代码编辑器 

### 下载代码

> git clone http://gitlab.iwhalecloud.com/portal/sso-frontend.git



### 安装运行

切换至公司源： nrm use znpm

安装： yarn

运行：yarn start  会自动打开浏览器显示界面



## 目录结构

```
.
├── config             -- 配置文件 
├── mock               -- mock文件 
├── public             -- 公用第三方文件
│   └── lang           -- 局部国际化
├── assets             -- 图片字体等资源文件 
├── scripts            -- 脚本  
└── src
    ├── components     -- 公共组件
    ├── layouts        -- 布局 
    ├── locales        -- 全局国际化
    ├── models         -- 模型
    ├── pages          -- 页面
	│   └── UserLogin  -- 登录模块  
    |   └── ...        -- 其他模块 
    ├── services       -- 公共服务
    └── utils          -- 常用工具类
```

## pages目录下单个模块分层

```
.
├── Modules                      -- 模块
│   ├── components               -- 非路由组件
│   ├── services                 -- 服务文件
│   ├── models                   -- 模型
│   ├── messages                 -- 局部国际化
│   ├── utils                    -- 模块内工具类(可选)
│   ├── config.js                -- 配置文件(可选) 
│   ├── _mock_.js                -- mock数据(可选)
│   ├── ***.less                 -- 样式文件(可选)
│   └── xxx.js                   -- 路由文件
```
## 约定

- `Modules`,`components`内文件命名方式统一为大写字母开头,驼峰式命名
- 路由文件的命名方式请参考[umi-约定式路由](https://umijs.org/zh/guide/router.html#%E7%BA%A6%E5%AE%9A%E5%BC%8F%E8%B7%AF%E7%94%B1)


## 新建模块的快捷方式
- 创建新的模块在项目主目录下输入:

```shell
node scripts/page.js
```
按照要求输入名称


> git clone http://gitlab.iwhalecloud.com/portal/sso-frontend.git



## 规范
  [JavaScript Style Guide](http://gitlab.iwhalecloud.com/portal/portal-react/blob/master/doc/JavaScriptStyleGuide.md)

## 样式管理

LESS

## 开发

采用前后端分离的开发模式，通过反向代理至SSO2.0后台服务器

### 前端工程下载及运行

```bash
// 请切换至公司源znpm
$ nrm use znpm
$ git clone http://gitlab.iwhalecloud.com/portal/sso-frontend.git
$ cd sso-frontend
$ yarn
$ yarn start         # visit http://localhost:8000
```

修改代码后，界面会自动刷新

### 代理服务器配置

目前代理服务器配置：代理至 http://portal.ztesoft.com:8083/sso2/  如果有其他服务器，可以更改配置

> config/config.js
```js
const target = 'http://portal.ztesoft.com:8083/sso2/';
export default {
  ...
  proxy: {
    '/login': {
      target,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/logged': {
      target,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/logout': {
      target,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/menus': {
      target,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    }
```

### mock模拟
对于后台接口还没有开发完毕的时候，采用mock进行数据模拟

### 添加区块


### 构建远程模块
使用`@fish/portal-plugin-monorepo-compile`插件，可构建单个模块或整个工程所有模块

```bash
$ yarn compile
```

## 浏览器支持

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions
