## yummp
>基于Gulp构建的 微信小程序及插件开发 方案

### 特性

+ 基于`gulp+less`构建的微信小程序工程项目
+ 项目图片自动压缩
+ ESLint代码检查
+ 使用命令行快速创建`page`、`template`和`component`
+ 支持生产环境打包

### Getting Started

```
首先保证全局安装的gulp和项目目录下本地的gulp版本相对
$ npm install -g gulp （全局安装）
$ npm install gulp （本地安装）
- 如果已经全局安装过gulp，先删除所有gulp相关东西，最好手工删除gulp目录

在项目所在目录查看gulp版本
$ gulp -v

如果如下显示，则版本一致（最新版本下的显示内容）
[17:36:54] CLI version 2.0.1
[17:36:54] Local version 4.0.0

```

```
$ npm run dev （开发环境打包）
$ npm run test (测试环境打包)
```

#### 新建page、template或者component
```
  gulp auto -p mypage           创建名为mypage的page文件
  gulp auto -t mytpl            创建名为mytpl的template文件
  gulp auto -c mycomponent      创建名为mycomponent的component文件
  gulp auto -s index -p mypage  复制pages/index中的文件创建名称为mypage的页面
```
#### 上传代码前编译
```
$ npm run build （生产环境打包）
```
##### 6. 上传代码，审核，发版

### 工程结构
```
ptp
├── dist         // 编译后目录
├── node_modules // 项目依赖
├── src 
│    ├── components // 微信小程序自定义组件
│    ├── env        // 请求域名配置
│    ├── images     // 页面中的图片和icon
│    ├── pages      // 小程序page文件
│    ├── styles     // ui框架，公共样式
│    ├── template   // 模板
│    ├── utils      // 公共js文件
│    ├── app.js
│    ├── app.json
│    ├── app.less
│    ├── project.config.json // 项目配置文件
│    └── api.config.js       // 项目api接口配置
├── .gitignore
├── .eslintrc.js
├── package-lock.json
├── package.json
└── README.md

```

### Gulp说明

```
Tasks:
  dev              开发编译，同时监听文件变化
  test             整体编译，请求指向测试环境
  build            整体编译

  clean            清空产出目录
  wxml             编译wxml文件（仅仅copy）
  js               编译js文件，同时进行ESLint语法检查
  json             编译json文件（仅仅copy）
  wxss             编译less文件为wxss
  img              编译压缩图片文件
  watch            监听开发文件变化
  devEnv/testEnv/prodEnv 生成对应环境的请求域名配置

  auto             自动根据模板创建page,template或者component(小程序自定义组件)

gulp auto 

选项：
  -s, --src        copy的模板                     [字符串] [默认值: "_template"]
  -p, --page       生成的page名称                                       [字符串]
  -t, --template   生成的template名称                                   [字符串]
  -c, --component  生成的component名称                                  [字符串]
  --msg            显示帮助信息                                           [布尔]

示例：
  gulp auto -p mypage           创建名为mypage的page文件
  gulp auto -t mytpl            创建名为mytpl的template文件
  gulp auto -c mycomponent      创建名为mycomponent的component文件
  gulp auto -s index -p mypage  复制pages/index中的文件创建名称为mypage的页面
```

#### `_template`目录的作用
```
使用`gulp auto`命令自动生成文件，`-s`参数可以指定copy的对象，默认情况下是以对应目录下文件夹为`_template`中的文件为copy对象的。开发者可以根据业务需求，自定义`_template`下的文件。

`_template`目录的文件是不会被编译到`dist`目录。
```


### TODO
- [x] 代码注释
- [x] 规范命令行使用
- [x] eslint
- [x] gulp增量编译
- [x] 生产环境打包


### 备注
原生小程序的开发模式，过于简陋，就样式来说，写惯了less，stylus和sass的一定无法忍受wxss的这种写法，使用gulp自动化工具来构建一套微信小程序开发的基础模板，在完全保留微信小程序功能和特性的基础上，又可以的使用less来写样式，同时加入图片压缩，命令行快速创建模板等特性，如此开发，快哉，快哉！

### 重要
- 所有对于“api.weixin.qq.com”域名下的接口请求请全部通过后台服务器发起，请勿直接通过小程序的前端代码发起
- wx.localstatus

### 拼团status状态：
  grp_status_create: 0,   //拼团状态：发起拼团
  grp_status_join: 1,     //拼团状态：参团
  grp_status_success: 2,  //拼团状态：拼团成功
  grp_status_fail: 999    //拼团状态：拼团失败

### 购买类型：
  - 0: 单独购买
  - 1: 团购价格


### 小程序接入拼团插件指南

  1、plugin接入
    在小程序的app.json中添加：
    "plugins": {
      "pt_plugin": {
        "version": "插件版本号",
        "provider": "插件APPID"
      }
    },

  2、在小程序的app.js中添加以下接入插件的交互外壳页面，没个路由对应一个页面，页面代码固定
    
    /*从插件返回到小程序的页面路由*/
    callbackUrl: {
      'index': '../pt-index/index',                       // 拼团首页
      'detail-prd': '../pt-detail-prd/index',             // 拼团商品详情
      'detail-grp': '../pt-detail-grp/index',             // 拼团详情
      'detail-order': '../pt-detail-order/index',         // 订单详情
      'confirm-order': '../pt-confirm-order/index',       // 订单确认
      'pay': '../pt-pay/index',                           // 支付呼出
      'login': '../pt-login/index'                        // 登录呼出
    }

    举例，pt-index(一个文件夹下包含以下三个文件，代码固定)，其中pt.common.js文件为一个共通文件，封装了一些跳转函数

      ## index.js
      const ptCommon = require('../pt.common.js');
      Page({
        data: {
        },
        onLoad() {
        },
        gotoPageFromPlugin(data) {
          ptCommon.gotoPageFromPlugin(data);
        }
      });

      ## index.json
      {
        "navigationBarTitleText": "CJ拼团_商品一览",
        "usingComponents": {
          "pt-index": "plugin://pt_plugin/index"
        }
      }

      ## index.wxml
      <pt-index bindcallback="gotoPageFromPlugin"/>

  3、小程序与插件的数据交互

    1）用户在小程序中的登录信息通过 wx.setStorageSync/wx.getStorageSync交互，

      key: ptinfo-for-CJ
      value: {
        usercode:
        avatarUrl:
        nickname:
        mobile:
      }
    
    2) 插件传给小程序数据是利用callback函数传递，如下

      let options = data.detail.options;
      let groupPrice = options.price;
    
    这个功能主要用户支付时候传递价格数据和支付URL返回的各种数据时使用


