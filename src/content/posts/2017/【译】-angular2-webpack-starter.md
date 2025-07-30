---
title: '【译】angular2-webpack-starter'
published: 2017-02-16 21:49:46
tags: 
  - webpack
  - Angular
toc: true
lang: zh
---

![angular2-webpack-starter](https://cloud.githubusercontent.com/assets/1016365/9863762/a84fed4a-5af7-11e5-9dde-d5da01e797e7.png)

<!--more-->

> 在[github](https://github.com/AngularClass/angular2-webpack-starter)上看到了这个项目，感觉挺好的，就拿过来翻译一下，顺便提高一下看英文文档的水平

## Angular2 Webpack Starter

本仓库作为Angular2初始化工具为所有寻找更快启动和运行Angular2和TypeScript的人提供帮助。这个项目使用webpack2来构建我们的文件和协助模块化。同时使用Protractor进行e2e测试、Karma进行单元测试。

* 这是Angular2在文件和应用架构方面最好的练习；
* 准备用webpack构建基于TypeScript的应用；
* 当尝试使用Angular2时，Angular2的案例已经准备好了；
* 对于想启动自己项目的人来说，这是一个极好的Angular2种子库；
* 为你产品构建的页面快速加载提供AoT编译；
* Tree shaking会自动删除包中没有用的代码；
* [Webpack DLLs](https://robertknight.github.io/posts/webpack-dll-plugins/)可以大大加快开发构建；
* 用Jasmine和Karma来测试Angular2的代码；
* 用Istanbul和Karma来进行测试覆盖；
* 用Protractor来进行Angular2代码的e2e测试；
* 用`@type`进行类型管理；
* 用webpack、[@angularclass/hmr](https://github.com/angularclass/angular2-hmr)和[@angularclass/hmr-loader](https://github.com/angularclass/angular2-hmr-loader)来做模块热替换(HMR)；
* 用[angular/material2](https://github.com/angular/material2)来做Material Design；
* 通过修改`package.json `实现对Angular4以及未来Angular任何版本的支持。



## Quick start

确保你的node版本大于5.0，npm版本大于3.0。

> 克隆或者下载这个仓库后，编辑在`/src/app/app.component.ts`里的`app.component.ts`。

```shell
# 克隆仓库
# --depth 1 表示克隆最近一次commit.
git clone --depth 1 https://github.com/angularclass/angular2-webpack-starter.git

# 切换目录
cd angular2-webpack-starter

# 用npm安装库
npm install

# 起一个服务
npm start

# 使用模块热替换
npm run server:dev:hmr

# 如果在中国，请使用cnpm
# https://github.com/cnpm/cnpm
```

在浏览器中打开 [http://0.0.0.0:3000](http://0.0.0.0:3000/) 或者 [http://localhost:3000](http://localhost:3000/) 。

## Table of Contents

### 文件结构

我们在项目中使用组件化的方法，这是开发Angular app的新标准，是一种通过封装行为逻辑来确保代码可维护性的极好的方法。一个组件基本上是一个完整的app，它通常在一个文件或者文件夹里面包含style, template, specs, e2e, and component class。下面是文件结构的样子：

```tex
angular2-webpack-starter/
 ├──config/                        * 配置
 |   ├──helpers.js                 * 配置文件的helper functions
 |   ├──spec-bundle.js             * 忽略这个设置Angular2测试环境的魔法
 |   ├──karma.conf.js              * 单元测试的karma配置
 |   ├──protractor.conf.js         * e2e测试的protractor配置
 │   ├──webpack.dev.js             * webpack开发环境配置
 │   ├──webpack.prod.js            * webpack产品环境配置
 │   └──webpack.test.js            * webpack测试环境配置
 │
 ├──src/                           * 将被编译成js的源代码
 |   ├──main.browser.ts            * 浏览器的入口文件
 │   │
 |   ├──index.html                 * Index.html: 用来生成index页面
 │   │
 |   ├──polyfills.ts               * polyfills文件
 │   │
 │   ├──app/                       * WebApp: 文件夹
 │   │   ├──app.component.spec.ts  * 在app.component.ts中的一个简单测试
 │   │   ├──app.e2e.ts             * 一个简单e2e测试
 │   │   └──app.component.ts       * 一个简单的App component
 │   │
 │   └──assets/                    * 静态资源存放在这边
 │       ├──icon/                  * www.favicon-generator.org图标列表
 │       ├──service-worker.js      * 忽略这个.service worker还没完成
 │       ├──robots.txt             * 让搜索引擎爬取你的网站
 │       └──humans.txt             * 让别人知道谁是开发者
 │
 │
 ├──tslint.json                    * typescript lint配置
 ├──typedoc.json                   * typescript文件生成
 ├──tsconfig.json                  * typescript使用外部webpack的配置
 ├──tsconfig.webpack.json          * webpack对typescript使用的配置
 ├──package.json                   * npm管理的项目依赖
 └──webpack.config.js              * webpack主要的配置文件

```



### 开始

#### 依赖

运行这个app你需要：

* `node`和`npm`（通过brew安装node）
* 确保你运行最新版本的Node`v4.X.X`(或者`v5.X.X`)和NPM`3.X.X`+

> 如果你已经安装`nvm`—特别推荐（可以通过brew安装`nvm`）—你可以通过`nvm install --lts && nvm use`来运行最新版本的Node。你也可以用`zsh`来帮你[自动完成](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file)。

一旦你完成这些，你应该用`npm insatll --global`安装这些全局包。

- `webpack` (`npm install --global webpack`)
- `webpack-dev-server` (`npm install --global webpack-dev-server`)
- `karma` (`npm install --global karma-cli`)
- `protractor` (`npm install --global protractor`)
- `typescript` (`npm install --global typescript`)

#### 安装

- `fork` 这个仓库
- `clone` 你fork的仓库
- `npm install webpack-dev-server rimraf webpack -g` 安装需要的全局依赖
- `npm install` 安装所有的依赖或者`yarn`
- `npm run server` 在另一个标签启动一个服务

#### 运行app

安装完所有的依赖以后，现在可以运行这个app。运行`npm run server`来启动一个本地服务，这个服务利用`webpack-dev-server` 来监听、构件（在内存中）和重新加载。通过这个端口`http://0.0.0.0:3000`可以访问页面（如果你是IPv6或者使用`express`服务，通过`http://[::1]:3000/`访问）。

##### 服务

```javascript
# development
npm run server
# production
npm run build:prod
npm run server:prod
```

#### 其他命令

##### 构件文件

```javascript
# development
npm run build:dev
# production (jit)
npm run build:prod
# AoT
npm run build:aot
```

##### 模块热替换

```javascript
npm run server:dev:hmr
```

##### 监听和构件文件

```javascript
npm run watch
```

##### 运行单元测试

```javascript
npm run test
```

##### 监听和运行测试

```javascript
npm run watch:test
```

##### 运行e2e测试

```javascript
# 升级Webdriver (可选, 通过postinstall script自动完成)
npm run webdriver:update
# 启动服务并且启用Protractor
npm run e2e
```

##### 集成测试（一起运行单元测试和e2e测试）

```javascript
# 测试JIT和AoT builds
npm run ci
```

##### 运行Protractor的elementExplorer (为e2e测试)

```javascript
npm run e2e:live
```

##### 构件Docker

```javascript
npm run build:docker
```

### 配置

 配置文件在`config/`目录下，一般用 webpack, karma, and protractor 作为项目的脚手架。

### AoT禁忌

下面是一些会使AoT编译失败的做法：

- 不需要为模板和样式声明，使用styleUrls and templateUrls，angular2-template-loader插件会在构建时声明；
- 不要使用默认的exports；
- 不要用 `form.controls.controlName`, 使用 `form.get(‘controlName’)`；
- 不要用 `control.errors?.someError`, 使用 `control.hasError(‘someError’)`；
- 不要在providers, routes 或者declarations中使用函数, 应该暴露一个函数，然后引用这个函数的名字；
- @Inputs, @Outputs, View , Content Child(ren), Hostbindings或者任何从模板、注释中使用的字段对Angular都应该是public。

### 外部样式

任何导入到项目中的样式或者在`src/styles`文件夹下的样式 (Sass 或者 CSS)  都将被编译成外部的 `.css` 并嵌入你的产品构建。

例如用Bootstrap作为外部样式: 1) 在`src/styles`文件夹下创建一个 `styles.scss` 文件 (名字不重要) ； 2) 用 `npm install` 安装你想要的Boostrap版本； 3) 在 `styles.scss` 加上 `@import 'bootstrap/scss/bootstrap.scss';` 4) 在 `src/app/app.module.ts` 其他声明下面加上: `import '../styles/styles.scss';`

### 贡献

你可以用组件的形式引进更多的案例，但是它们必须引入一些新的概念，比如 `Home` component (独立文件夹)和Todo (服务)。我将会很乐意接受，所以尽情Pull-Request。

### TypeScript

> 全局安装TypeScript，并使用带有TypeScript插件的编辑器，利用自动补全来充分使用TypeScript。

#### 使用最新的TypeScript 

TypeScript 2.1.x 包含所有你需要的东西。 请确保升级到这个版本，即使你之前已经安装了TypeScript。

```javascript
npm install --global typescript
```

#### 使用支持TypeScript的编辑器

推荐使用下面的编辑器:

- [Visual Studio Code](https://code.visualstudio.com/)
- [Webstorm 10](https://www.jetbrains.com/webstorm/download/)
- 带 [TypeScript plugin](https://atom.io/packages/atom-typescript)的[Atom](https://atom.io/) 
- 带 [Typescript-Sublime-Plugin](https://github.com/Microsoft/Typescript-Sublime-plugin#installation)的[Sublime Text](http://www.sublimetext.com/3) 

#### Visual Studio Code + Debugger for Chrome

> 安装 [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) ，然后去看操作指南

项目中的 `.vscode` 会自动连接到webpack development server 的 `3000`端口。

### Types

> 当你引入一个没有定义类型的模块，你可以用@types引入外部类型定义。

比如，为了让YouTube api运行，在终端中输入下面的命令：

```javascript
npm i @types/youtube @types/gapi @types/gapi.youtube
```

在一些案例中，你的代码编辑器不支持Typescript 2或者这些类型不在`tsconfig.json`列表内，这时候把这些类型增加到**"src/custom-typings.d.ts"** 中来帮助编译时检查：

```typescript
import '@types/gapi.youtube';
import '@types/gapi';
import '@types/youtube';
```

#### 类型定义习惯

如果需要用到第三方模块，当它没有提供类型定义时，同样需要为模块引入类型定义。你可以试着用@types来完成：

```javascript
npm install @types/node
npm install @types/lodash
```

如果你不能在库中找到对应的类型定义，可以暂时在文件中使用ambient definition ：

```typescript
declare module "my-module" {
  export function doesSomething(value: string): string;
}
```

如果导入的模块是使用Node.js，你需要这样引入：

```typescript
import * as _ from 'lodash';
```

### 常见问题

* 如何知道当前浏览器时候支持Angular2？

  答：请查看这个更新列表：[browser support for Angular 2](https://github.com/angularclass/awesome-angular2#current-browser-support-for-angular-2)。

* 为什么服务没有正确注入参数？

  答：请使用 `@Injectable()` ，以便让TypeScript的服务正确的依附上元数据（这是TypeScript的问题）。


* 怎么才能用node 0.12.X运行protractor？

  答：请切换到这个仓库以便使用老版本的protractor，参见 [#146](https://github.com/AngularClass/angular2-webpack-starter/pull/146/files)

* 在哪里写测试？

  答：可以在组件文件下写你的测试。 例如 [`/src/app/home/home.component.spec.ts`](https://github.com/AngularClass/angular2-webpack-starter/blob/master/src/app/home/home.component.spec.ts)

* 当报 `EACCES` 和 `EADDRINUSE` 错误时，如何启动app？

  答： `EADDRINUSE` 错误是 `3000` 端口已经被使用了，  `EACCES` 错误是webpack在`./dist/`目录下没有权限来构建文件。

* 如何在css中使用 `sass` ？

  答：使用`loaders: ['raw-loader','sass-loader']` 和 `@Component({ styleUrls: ['./filename.scss'] })` ，参见 Wiki [How to include SCSS in components](https://github.com/AngularClass/angular2-webpack-starter/wiki/How-to-include-SCSS-in-components), 或者  [#136](https://github.com/AngularClass/angular2-webpack-starter/issues/136) 问题。

* 如何测试服务？

  答：参见 [#130](https://github.com/AngularClass/angular2-webpack-starter/issues/130#issuecomment-158872648)

* 如何增加 `vscode-chrome-debug` 支持？

  答：VS Code chrome debug 插件的支持可以通过 `launch.json` 来实现，参见 [#144](https://github.com/AngularClass/angular2-webpack-starter/issues/144#issuecomment-164063790)。

* 如何让这个仓库在虚拟机上运行？

  答：host使用 `0.0.0.0` ，参见 [#205](https://github.com/AngularClass/angular2-webpack-starter/pull/205/files)。

* Angular 2的命名约定是什么？

  答：参见 [#185](https://github.com/AngularClass/angular2-webpack-starter/issues/185) 和 [196](https://github.com/AngularClass/angular2-webpack-starter/pull/196)。

* 如何引入bootstrap或者jQuery？

  答：参见 [#215](https://github.com/AngularClass/angular2-webpack-starter/issues/215) 和[#214](https://github.com/AngularClass/angular2-webpack-starter/issues/214#event-511768416)。

* 组件如何异步加载？

  答：参见 [How-do-I-async-load-a-component-with-AsyncRoute](https://github.com/AngularClass/angular2-webpack-starter/wiki/How-do-I-async-load-a-component-with-AsyncRoute)。

* Error: Cannot find module 'tapable'

  答：移除 `node_modules/` ，然后运行 `npm cache clean` ，最后 `npm install`。

* 如何开启模块热替换？

  答：运行 `npm run server:dev:hmr`。

* RangeError: Maximum call stack size exceeded

  答：这是压缩Angular2和JIT模板时的错误，可以把`mangle` 设置为`false`。

* 为什么app比development大？

  答：因为使用了inline source-maps和模块热替换，这回导致包的大小增加。

* 如果你在中国，请使用[https://github.com/cnpm/cnpm](https://github.com/cnpm/cnpm)。

* 如果希望增加Angular 2 Material Design，切换到[material2](https://github.com/AngularClass/angular2-webpack-starter/tree/material2)分支。

* node-pre-gyp ERR in npm install (Windows)

  答：安装Python x86，Windows版本在2.5 和 3.0之间 参见： [#626](https://github.com/AngularClass/angular2-webpack-starter/issues/626)。

* `Error:Error: Parse tsconfig error [{"messageText":"Unknown compiler option 'lib'.","category":1,"code":5023},{"messageText":"Unknown compiler option 'strictNullChecks'.","category":1,"code":5023},{"messageText":"Unknown compiler option 'baseUrl'.","category":1,"code":5023},{"messageText":"Unknown compiler option 'paths'.","category":1,"code":5023},{"messageText":"Unknown compiler option 'types'.","category":1,"code":5023}]`

  答：移除 `node_modules/typescript` ，然后运行 `npm install typescript@beta`。当前仓库使用的是ts 2.0。

* "There are multiple modules with names that only differ in casing"

  答：修改 `c:\[path to angular2-webpack-starter]` 为 `C:\[path to angular2-webpack-starter]` （c变为大写）参见： [926#issuecomment-245223547](https://github.com/AngularClass/angular2-webpack-starter/issues/926#issuecomment-245223547)。

### 支持、问题和反馈

> 对这个项目或者Angular2有任何问题欢迎随时联系我们

- [Chat: AngularClass.slack](http://angularclass.com/member-join/)
- [Twitter: @AngularClass](https://twitter.com/AngularClass)
- [Gitter: AngularClass/angular2-webpack-starter](https://gitter.im/angularclass/angular2-webpack-starter)

