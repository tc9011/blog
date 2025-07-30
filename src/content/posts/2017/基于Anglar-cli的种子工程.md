---
title: 基于Anglar-cli的种子工程
published: 2017-04-25 21:44:34
tags: 
  - Angular
toc: true
lang: zh
---

![2017042514931283388670.jpg](../_images/基于Anglar-cli的种子工程/2017042514931283388670.jpg)

<!--more-->

为公司项目做了一个种子工程，方便以后做Demo或者其他工程。

项目地址：[Angular-cli-starter](https://github.com/tc9011/Angular-cli-starter)

## 说明

node版本 7.9.0

npm版本 4.2.0

Angular版本 4.0.2

AngularCLI版本 1.0.0

已经引入了Angular Material、ngx-bootstrap、bootstrap、karma-firefox-launcher、fontawesome、echarts、jQuery、moment.js。

## 使用
1. 在node_modules的文件夹下找到/node_modules/@angular/cli/bin/

2. 然后在终端中pwd输出路径

3. 在root目录下找到~/bash_profile文件，用vim打开，把下面路径两个字换成刚刚得到的路径，然后写入文件中

    `alias ng="路径/ng"`

4. 在终端执行'. ~/.bash_profile'(如果遇到command not found: ng，重新运行一下这个命令)

5. 项目中使用了sass做css预编译,因此需要安装sass,安装方法见下文

6. 在项目根目录执行`npm install `

7. `ng serve --open`

注：
 1. 1-4步可以用`npm i @angular/cli@latest -g`代替，而且不会经常需要执行第四步;

 2. 如果项目在虚机中，需要在外部浏览器访问，可以查询到虚机ip地址后，用`ng serve --host ip地址`来起服务，在外部用虚机地址+端口号访问。

## 安装Sass
sass基于Ruby语言开发而成，因此安装sass前需要安装Ruby，下面以linux系统安装为例子（mac自带ruby,windows下安装参考[Sass官网](https://www.sass.hk/install/)）

1. 去[Ruby](http://www.ruby-lang.org/en/downloads/)官网下载Ruby 2.4.1版本到本地

2. 分别运行以下命令安装：

```shell
cd ruby-2.4.1
./configure
make
sudo make install
```
3. 安装完后输入`ruby -v`，若出现ruby版本号表示安装成功

ruby安装完成后就可以安装sass和Compass了,在ruby目录下打开终端，输入：
```shell
gem install sass
gem install compass
```
每个安装过程都会看到如下输出：
```shell
Fetching: sass-3.x.x.gem (100%)
Successfully installed sass-3.x.x
Parsing documentation for sass-3.x.x
Installing ri documentation for sass-3.x.x
Done installing documentation for sass after 6 secon
1 gem installed
```
安装完成后，在终端输入`sass -v`和`compass -v`，若出现版本号表示安装成功。

若遇到gem下载不稳定，可以参考[官网](https://www.sass.hk/install/)更换gem源

## 关于AOT和摇树优化

打开命令行，进入App根目录，执行以下命令：
`ng build --prod --aot`

加上--prod参数之后，angular-cli会自动启用TreeShaking（摇树）特性，简而言之，就是把用不到的包全部剔除掉，就像从树上把枯叶子摇下来一样，加上--aot参数是让angular-cli启动预编译特性。

【请注意】最新版本的angular-cli已经内置了对AOT和TreeShaking的支持，只要像上面这样在build的时候加上--prod和--aot参数就可以了，不需要再做任何其它任何配置工作，官方网站上的那一篇指南有点过时了。

## 引入外部组件
* 引入ngx-bootstrap

在所要引入的模块的module文件中import就行：
```typescript
import { AlertModule } from 'ngx-bootstrap';
@NgModule({
  imports: [
    AlertModule.forRoot(),
  ]
})
export class XXXModule { }
```
组件列表及使用参考官网：[ngx-bootstrap组件](https://valor-software.com/ngx-bootstrap/#/)

* 引入Angular Material

```typescript
import { MdAutocompleteModule } from '@angular/material';
@NgModule({
  imports: [
    MdAutocompleteModule,
  ]
})
export class XXXModule { }
```
组件列表及使用参考官网：[Angular Material](https://material.angular.io/)

* 引入echarts、jQuery、moment.js

在所需**组件**中import就行：
```typescript
import echarts from 'echarts';
import $ from 'jquery/dist/jquery';
import * as moment from 'moment';
```
## 注意事项

目录结构可以参考如dir-desc.txt文件。

项目中新建css文件时，后缀名统一为.scss。scss完全兼容css(可以在scss文件中直接写css)。scss的使用可以看参考文章7。

## 参考文章

1. [command not found: ng的解决办法](https://github.com/angular/angular-cli/issues/503)
2. [Angular 2 升级 Angular 4](http://www.jianshu.com/p/75c19d67d7f8)
3. [如何利用angular-cli组织项目结构](https://segmentfault.com/a/1190000008623106)
4. [预(AOT)编译器](https://angular.cn/docs/ts/latest/cookbook/aot-compiler.html)
5. [【重要】启用AOT+TreeShaking+Gzip大幅度压缩Angular2应用的体积 ](https://my.oschina.net/mumu/blog/830742)
6. [大漠穷秋Angular4完整案例](http://git.oschina.net/mumu-osc/NiceFish)
7. [anuglar-2-animate.css-example](https://github.com/CanKattwinkel/anuglar-2-animate.css-example)
8. [Angular 2 Animate.css Tutorial – How to use Animate.CSS in NG2 Application?](https://blog.thecodecampus.de/angular-2-animate-css-tutorial-use-animate-css-ng2-application/)
9. [Sass官网](http://www.sass.hk/)
10. [Sass入门](http://tc9011.com/2017/04/08/Sass%E5%85%A5%E9%97%A8/)



