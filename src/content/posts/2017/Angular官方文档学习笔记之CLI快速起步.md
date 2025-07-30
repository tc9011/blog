---
title: Angular官方文档学习笔记之CLI快速起步
published: 2017-03-06 20:17:22
tags: 
  - Angular
toc: true
lang: zh
---

![20170306849271-9NsyipQ1PVUMZEzECecjgQ.jpeg](../_images/Angular官方文档学习笔记之CLI快速起步/20170306849271-9NsyipQ1PVUMZEzECecjgQ.jpeg)

<!--more-->

[**Angular-CLI**](https://cli.angular.io/)是一个**命令行界面**工具，它可以创建项目、添加文件以及执行一大堆开发任务，比如测试、打包和发布。

## 设置开发环境

`node`版本`4.X.X`以上，`npm`版本`3.X.X`以上。

全局安装Angular-CLI：

```shell
npm install -g @angular/cli
```

## 创建新项目及应用骨架

运行下面命名生成一个新项目以及应用的骨架代码：

```shell
ng new my-app
```

## 启动开发服务器

进入项目目录，并启动服务器。

```shell
cd my-app
ng serve
```

`ng serve`命令会启动开发服务器，监听文件变化，并在修改这些文件时重新构建此应用。

在浏览器中打开`http://localhost:4200/`，可以显示应用信息。

## 项目文件概览

### src文件夹

你的应用代码位于`src`文件夹中。 所有的Angular组件、模板、样式、图片以及你的应用所需的任何东西都在那里。 这个文件夹之外的文件都是为构建应用提供支持用的。

```markdown
src
|--app
|	|-app.component.css
|	|-app.component.html
|	|-app.component.spec.ts
|	|-app.component.ts
|	|-app.module.ts
|--assets
|	|-.gitkeep
|--environments
|	|-environment.prod.ts
|	|-environment.ts
|--favicon.ico
|--index.html
|--main.ts
|--polyfills.ts
|--styles.css
|--test.ts
|--tsconfig.json
```

`assets/*`文件夹下放图片等任何东西，在构建应用时，它们全都会拷贝到发布包中。

`environments/*`文件夹中包括为各个目标环境准备的文件，它们导出了一些应用中要用到的配置变量。 这些文件会在构建应用时被替换。 比如你可能在产品环境中使用不同的API端点地址，或使用不同的统计Token参数。 甚至使用一些模拟服务。 

`index.html`大多数情况下你都不用编辑它。 在构建应用时，CLI会自动把所有`js`和`css`文件添加进去，所以你不必在这里手动添加任何 ``或 `` 标签。

`polyfills.ts`能帮我们把不同的浏览器对Web标准的支持程度进行标准化。

### 根目录

`src/`文件夹是项目的根文件夹之一。 其它文件是用来帮助你构建、测试、维护、文档化和发布应用的。它们放在根目录下，和`src/`平级。

```markdown
my-app
|--e2e
|  |-app.e2e-spec.ts
|  |-app.po.ts
|  |-tsconfig.json
|--node_modules/...
|--src/...
|--.editorconfig
|--.gitignore
|--angular-cli.json
|--karma.conf.js
|--package.json
|--protractor.conf.js
|--README.md
|--tslint.json
```

`protractor.conf.js`给[Protractor](http://www.protractortest.org/)使用的端到端测试配置文件，当运行`ng e2e`的时候会用到它。

`tslint.json`给[TSLint](https://palantir.github.io/tslint/)和[Codelyzer](http://codelyzer.com/)用的配置信息，当运行`ng lint`时会用到。 Lint功能可以帮你保持代码风格的统一。

## 生成组件、指令、管道和服务

```shell
ng generate component my-new-component
ng g component my-new-component # 简写

# 组件支持关联路径生成
# 如果在src/app/feature/目录中，可以运行：
ng g component new-cmp
# 在src/app/feature/new-cmp中生成组件
# 但是如果这样运行：
ng g component ../newer-cmp
# 组件将会在src/app/newer-cmp中生成
```

用下面的命令可以生成各种模板：

|    模板     |               用法                |
| :-------: | :-----------------------------: |
| Directive | ` ng g directive my-directive`  |
| Component | `ng  g  component my-component` |
|   Pipe    |       `ng g pipe my-pipe`       |
|  Service  |    `ng g service my-service`    |
|   Class   |      `ng g class my-class`      |
| Interface |  `ng g interface my-interface`  |
|   Enum    |       `ng g enum my-enum`       |
|  Module   |     `ng g module my-module`     |

