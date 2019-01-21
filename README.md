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
yummp
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
